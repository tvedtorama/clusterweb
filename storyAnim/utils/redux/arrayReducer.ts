import { Action } from "redux";

const checkType = <T extends StoryAnimDataSchema.IItemBase>(t: Action | ReduxActions.IPayloadAction<T>, actionTypes: string[]): t is ReduxActions.IPayloadAction<T> & Action =>
	actionTypes.find(type => type && ((<Action>t).type === type)) ? true : false

export const arrayReducer = <T extends StoryAnimDataSchema.IItemBase>(storeActionType: string, deleteActionType?: string) =>
	(state: T[] = [], action: Action | ReduxActions.IPayloadAction<T>) => [checkType<T>(action, [storeActionType, deleteActionType]) && {
			id: action.payload.id,
			insert: action.type === deleteActionType ? [] : [action.payload]
		}].
		filter(x => x).
		map(act => [...state.filter(x => x.id !== act.id), ...act.insert])[0] || state
