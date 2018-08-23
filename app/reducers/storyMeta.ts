import { SET_STORY_META } from "../sagas/mainLoop";
import { Action } from "redux";


type IStoryMeta = State.IState["storyMeta"]

export const storyMeta = (state: IStoryMeta = {}, action: Action & {payload}): IStoryMeta =>
	action.type === SET_STORY_META ? action.payload : state