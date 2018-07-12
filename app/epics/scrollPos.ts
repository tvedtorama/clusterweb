import { Observable, fromEvent, interval } from "rxjs";
import { map, filter, buffer } from "rxjs/operators";
import { Action } from "redux";
import { SET_EVENT_DATA } from "../../storyAnim/actions/eventData";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";

// TODO: Bring in the start and end position in the scroll percentage.  Should stay at 0% or 100% when the sliding box is not moving.
// Note: Would really like to use something other than buffer, to preserve the observable nature.  `window` seems to be an option, but I think it will delay the input by a frame.
export const scrollPosEpic = (action$: Observable<Action>) =>
	fromEvent(document, "scroll").pipe(
		map((e: UIEvent) => (e.target as Document).scrollingElement),
		filter(e => e.tagName === "HTML"),
		map(e => ({pos: e.scrollTop * 100 / (e.scrollHeight - e.clientHeight)})),
		map(x => ({type: SET_EVENT_DATA, eventData: <StoryAnim.IEventData>{...x, type: "SCROLL_POS"}})),
		buffer(interval(0, animationFrame)),
		filter(x => x.length > 0),
		map(x => x[x.length - 1]),
	)
