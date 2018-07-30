import { Action } from "redux";

const checkType = <T extends StoryAnimDataSchema.IItemBase>(t: Action | ReduxActions.IPayloadAction<T>, actionTypes: string[]): t is ReduxActions.IPayloadAction<T> & Action =>
	actionTypes.find(type => type && ((<Action>t).type === type)) ? true : false

export const arrayReducerInternal = <T extends StoryAnimDataSchema.IItemBase>(storeActionType: string, deleteActionType: string, insertFormula: (current: T, action: ReduxActions.IPayloadAction<T> & Action, isDelete: boolean) => T[]) =>
	(state: T[] = [], action: Action | ReduxActions.IPayloadAction<T>) => [checkType<T>(action, [storeActionType, deleteActionType]) &&
		[state.find(x => x.id === action.payload.id)].map(current => ({
			id: action.payload.id,
			current,
			insert: insertFormula(current, action, action.type === deleteActionType)
		}))[0]].
		filter(x => x).
		map(act => [...state.filter(x => x !== act.current), ...act.insert])[0] || state

export const arrayReducer = (storeActionType: string, deleteActionType?: string) =>
	arrayReducerInternal(storeActionType, deleteActionType,
		(current, action, isDelete) => isDelete ? [] : [action.payload])
