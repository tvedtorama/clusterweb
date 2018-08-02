import { IStoryRunnerProvider } from "../storyRunner";

/** Given segments definitions and story functions, produces a method that generates a list of valid stories for a given state */
export class StoryComposer<
			TSegDef extends (v: (s: StoryAnim.IEventState) => boolean) => IStoryRunnerProvider,
			TSeg extends {validFunc: () => ((s: StoryAnim.IEventState) => boolean), meta: () => {startPos: number}}> {

	segDefs: {segDef: TSegDef, segment: TSeg}[] = []
	addStory(segment: TSeg, segDef: TSegDef) {
		this.segDefs.push({segment, segDef})
	}

	/** Evaluates all segments validator functions and generates a method that selects the ones valid for a given eventState */
	getStorySelector() {
		const testers = this.segDefs.
			map(({segment, segDef}) =>
				[segment.validFunc()].
				map(vf => (s: StoryAnim.IEventState) =>
					vf(s) ? segDef(vf) : null)[0])
		return (eventState: StoryAnim.IEventState) => testers.map(x => x(eventState)).filter(x => x)
	}

	/** Returns the meta data for the start of all segments */
	getSegmentMetas() {
		return this.segDefs.map(x => x.segment.meta())
	}
}
