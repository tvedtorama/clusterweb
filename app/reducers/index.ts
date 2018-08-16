import { combineReducers } from "redux";
import { count } from "./countTest";
import { sagaStoriesReducers } from "saga-stories";

export default combineReducers({count, ...sagaStoriesReducers})
