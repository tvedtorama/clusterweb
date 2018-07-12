import { Action } from "redux";
import { SET_EVENT_DATA } from "../actions/eventData";

export const eventState = (state: StoryAnim.IEventState = {pos: 0, frameTime: +(new Date())}, action: Action & {eventData: StoryAnim.IEventData}) =>
	action.type === SET_EVENT_DATA ?
		[{...state, ...action.eventData}].map(({type, ...others}) => others)[0] : // Merge and omit `type`
		state
