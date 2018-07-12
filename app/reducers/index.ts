import { combineReducers } from "redux";
import { count } from "./countTest";
import { storyAppReducers } from "../../storyAnim/reducers";

export default combineReducers({count, ...storyAppReducers})
