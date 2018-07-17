import { Action } from "redux";

export const STORE_STORY_ITEM = "STORE_STORY_ITEM"
export const DELETE_STORY_ITEM = "DELETE_STORY_ITEM"

export type IStoreStoryItemAction = Action & {payload: StoryAnimDataSchema.IStoryItem}

export const storeStoryItem = (payload: StoryAnimDataSchema.IStoryItem) => ({type: STORE_STORY_ITEM, payload})
export const deleteStoryItem = (payload: {id: string}) => ({type: DELETE_STORY_ITEM, payload})