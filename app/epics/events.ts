import { Observable, fromEvent, interval, timer } from "rxjs";
import { map, filter, buffer, merge } from "rxjs/operators";
import { Action } from "redux";
import { setEventData } from "saga-stories";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { scrollContainerClassName } from "../components/ScrollingContTest";

const getClientHeight = (e: Element) =>
	e.tagName === "BODY" ? e.parentElement.clientHeight : e.clientHeight

const TIMER_INTERVAL = 500

let _scrollItemTopBottom: HTMLDivElement = null

const getScrollItemTopAndHeight = () => {
	const item = _scrollItemTopBottom ? _scrollItemTopBottom : <HTMLDivElement>document.getElementsByClassName(scrollContainerClassName)[0]
	_scrollItemTopBottom = item
	return [item.offsetTop, item.offsetHeight]
}

// TODO: Bring in the start and end position in the scroll percentage.  Should stay at 0% or 100% when the sliding box is not moving.
// Note: Would really like to use something other than buffer, to preserve the observable nature.  `window` seems to be an option, but I think it will delay the input by a frame.
export const createEventsEpic = (getTime: () => number) =>
	[getTime()].map(startTime =>
		(action$: Observable<Action>) =>
			fromEvent(document, "scroll").pipe(
				map((e: UIEvent) => (e.target as Document).scrollingElement),
				filter(e => e.tagName === "HTML" || e.tagName === "BODY"),
				map(e => ({e, clnt: getScrollItemTopAndHeight()})),
				map(({e, clnt}) => ({pos: Math.max(0, Math.min(100, (e.scrollTop - clnt[0]) * 100 / (clnt[1] - getClientHeight(e))))})),
				map(x => setEventData({...x, type: "SCROLL_POS"})),
				merge(timer(0, TIMER_INTERVAL).
					pipe(
						map(t => setEventData({frameTime: getTime() - startTime, type: "TIME"}))
					)),
				buffer(interval(0, animationFrame)),
				filter(x => x.length > 0),
				map(x => x[x.length - 1]),
			)
	)[0]
