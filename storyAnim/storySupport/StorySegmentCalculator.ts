import { isUndefined } from "../utils/lowLevelUtils";

/** Creates segments with start and end-point, and a valid function that generates a function that tests a given state for validity.
 *
 * NB: Do not call validfunc(), or meta() until all segments are added.
*/
export class StorySegmentCalculator {
	segments: {start: number, end: number}[] = []

	_getTotalLength() {
		return Math.max(...this.segments.map(x => x.end))
	}

	addSegment(duration: number = -1, start?: number) {
		const segIdx = this.segments.length
		const actualStart = isUndefined(start) ? (segIdx > 0 ? this.segments[segIdx - 1].end : 0) : start
		const actualDuration = duration > -1 ? duration : (this._getTotalLength() - actualStart)
		const segment = {start: actualStart, end: actualStart + actualDuration}
		this.segments.push(segment)
		const startPos = (t) => segment.start * 100 / t
		return {
			...segment,
			/** Returns a function that says if the segment is valid, given a state. */
			validFunc: () =>
				[this._getTotalLength()].
				map(t => (s: StoryAnim.IEventState) => s.pos >= startPos(t) && s.pos < segment.end * 100 / t)
				[0],
			/** Returns meta data about this segment. */
			meta: () =>
				[this._getTotalLength()].
				map((t) => ({startPos: startPos(t)}))[0]
		}
	}
}
