import { combineReducers } from "redux";
import { count } from "./countTest";
import { items } from "../../storyAnim/reducers/items";

export default combineReducers({count, items})
