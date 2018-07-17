import { STORE_STORY_ITEM, DELETE_STORY_ITEM } from "../actions/storyItem";
import { arrayReducer } from "../utils/redux/arrayReducer";

export const items = arrayReducer<StoryAnimDataSchema.IStoryItem>(STORE_STORY_ITEM, DELETE_STORY_ITEM)
