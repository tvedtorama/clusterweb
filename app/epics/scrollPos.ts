import { Observable, fromEvent } from "rxjs";
import { map, filter } from "rxjs/operators";
import { Action } from "redux";
import { SET_EVENT_DATA } from "../../storyAnim/actions/eventData";

// TODO: Bring in the start and end position in the scroll percentage.  Should stay at 0% or 100% when the sliding box is not moving.
export const scrollPosEpic = (action$: Observable<Action>) =>
	fromEvent(document, "scroll").pipe(
		map((e: UIEvent) => (e.target as Document).scrollingElement),
		filter(e => e.tagName === "HTML"),
		map(e => ({pos: e.scrollTop * 100 / (e.scrollHeight - e.clientHeight)})),
		map(x => ({type: SET_EVENT_DATA, eventData: <StoryAnim.IEventData>{...x, type: "SCROLL_POS"}}))
	)