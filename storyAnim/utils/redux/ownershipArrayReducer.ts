import { arrayReducerInternal } from "./arrayReducer";

type IOwnershipType = StoryAnimDataSchema.IItemBase & Partial<StoryAnimDataSchema.IItemOwners>

const not = fn => x => !fn(x);
const isIn = <T>(set: Set<T>) => (x: T) => set.has(x);
const setDifference = <T>(a: Iterable<T>, b: Set<T>) => new Set([...a].filter(not(isIn(b))));
const setUnion = <T>(a: Iterable<T>, b: Set<T>) => new Set([...a, ...b]);

const insertAction = (current: IOwnershipType, {payload}: {payload: IOwnershipType}, isDelete: boolean) =>
	[new Set([...(payload.owners || [])])].map(payloadOwners =>
		isDelete ?
			(current && payloadOwners.size > 0 ?
				[setDifference(current.owners, payloadOwners)].map(differences =>
					differences.size > 0 ? [{...current, owners: [...differences]}] :
					[]
				)[0] :
				[]) :
			[{...payload, owners: [...setUnion(current && current.owners || [], payloadOwners)]}]
	)[0]

/** Similar to the simple `arrayReducer`, but tracks ownership as a ref-counting mechanism to allow items to persist
 * when more than one client is using them. */
export const ownershipArrayReducer = <T extends IOwnershipType>(storeActionType: string, deleteActionType?: string) =>
	arrayReducerInternal<T>(storeActionType, deleteActionType, insertAction as any)
