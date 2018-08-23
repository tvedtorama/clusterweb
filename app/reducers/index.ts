import { combineReducers } from "redux";
import { count } from "./countTest";
import { sagaStoriesReducers } from "saga-stories";
import { storyMeta } from "./storyMeta";

export default combineReducers({count, storyMeta, ...sagaStoriesReducers})
