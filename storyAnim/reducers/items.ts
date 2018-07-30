import { STORE_STORY_ITEM, DELETE_STORY_ITEM } from "../actions/storyItem";
import { ownershipArrayReducer } from "../utils/redux/ownershipArrayReducer";

export const items = ownershipArrayReducer<StoryAnimDataSchema.IStoryItem>(STORE_STORY_ITEM, DELETE_STORY_ITEM)