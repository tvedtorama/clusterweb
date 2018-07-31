import { isUndefined } from "../utils/lowLevelUtils";

/** Creates segments with start and end-point, and a valid function that generates a function that tests a given state for validity.
 *
 * NB: Do not call validfunc() until all segments are added.
*/
export class StorySegmentCalculator {
	segments: {start: number, end: number}[] = []

	_getTotalLength() {
		return Math.max(...this.segments.map(x => x.end))
	}

	addSegment(duration: number, start?: number) {
		const segIdx = this.segments.length
		const actualStart = isUndefined(start) ? (segIdx > 0 ? this.segments[segIdx - 1].end : 0) : start
		const segment = {start: actualStart, end: actualStart + duration}
		this.segments.push(segment)
		return {
			...segment,
			validFunc: () =>
				[this._getTotalLength()].
				map(t => (s: StoryAnim.IEventState) => s.pos >= segment.start * 100 / t && s.pos < segment.end * 100 / t)
				[0]
		}
	}
}
