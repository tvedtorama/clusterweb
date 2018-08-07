import Ix from "ix";
import { IStoryRunnerProvider, IStoryRunnerChildrenStatus, IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { NOP } from "../../storyAnim/actions/nop";
import { storeStoryItem } from "../../storyAnim/actions/storyItem";
import { CONTAINER_COMPONENT } from "../../storyAnim/components/Container";
import { ROOT_STORY_ID } from "../../storyAnim/storySupport/rootStory";
import { filterChildren } from "../../storyAnim/storySupport/filterChildren";
import { IWorldMapProps } from "../components/story/WorldMap";
import { StorySegmentCalculator } from "../../storyAnim/storySupport/StorySegmentCalculator";
import { StoryComposer } from "../../storyAnim/storySupport/StoryComposer";
import { ISlideKey } from "../components/slides";
import { ISlideProps } from "../../storyAnim/components/Slide";
import { PROGRESS_INDICATOR, IProgressIndicatorProps } from "../../storyAnim/components/ProgressIndicator";
import { boatStory } from "./boatStory";
import { oilRigStory } from "./oilRigStory";
import { progressIndicator } from "../../storyAnim/storySupport/progressIndicator";

export const rootStoryId = "ALMOST_ROOT"
export const commonProps = {id: rootStoryId, parentId: ROOT_STORY_ID}
export const commonChildProps = (id) => ({id, parentId: rootStoryId})

// This is just a dummy, running all the time. Should be either a common construct, or somehow replaced by the real root.
export const clusterStories = function*(initialState: StoryAnim.IEventState) {
	yield storeStoryItem({
		position: {},
		...commonProps,
		visual: {
			component: CONTAINER_COMPONENT,
			props: {},
		}
	})
	while (true)
		yield {type: NOP}
}

export const mapStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, wmp?: IWorldMapProps, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*(initialState: StoryAnim.IEventState) {
	yield storeStoryItem({
		position,
		startPosition: position,
		...commonChildProps("THE_MAP"),
		visual: {
			component: "MAP",
			props: wmp || {},
			classNameAdd: "world-map-root",
		}
	})
	while (true) {
		const state: IStoryRunnerYieldFormat = yield {type: NOP}
		if (!existenceCheck(state.eventState))
			return
	}
}

export const slideStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, slideText: string | {s: ISlideKey}, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*() {
		yield storeStoryItem({
			position,
			startPosition: position,
			...commonChildProps("THE_SLIDE"),
			order: 200,
			visual: {
				component: "SLIDE",
				props: (typeof slideText === "string" ? <ISlideProps>{text: slideText} : <ISlideProps>{slide: slideText.s}),
			}
		})
		while (true) {
			const state: IStoryRunnerYieldFormat = yield {type: NOP}
			if (!existenceCheck(state.eventState))
				return
		}
	}


const fullscreenMapFunc = vf => <IStoryRunnerProvider>{
	id: "MAPS_INIT",
	getStory: mapStory(vf),
	getChildrenIterator: function*() {}
}

const upcloseMapProps = {x: -95, scale: 0.40, rotateX: 0}
const slideSideCommonProps = {x: 25, scale: 0.65}

const calc = new StorySegmentCalculator()
const mangler = new StoryComposer()
const intermessoLength = 5
mangler.addStory(calc.addSegment(20), fullscreenMapFunc)
const norwayFirstStepSegment = calc.addSegment(10)
mangler.addStory(norwayFirstStepSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_NORWAY",
	getStory: mapStory(vf, {selectedHotspot: 1}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(calc.addSegment(10), vf => <IStoryRunnerProvider>{
	id: "MAPS_NORWAY_VERY_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 1, closeness: "VERY_CLOSE"}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
// Create boat animations - these time out and are recreated.  The stories have an inherent rotation and delay.
for (const i of Ix.Iterable.range(0, 5))
	mangler.addStory(norwayFirstStepSegment, vf => <IStoryRunnerProvider>{
		id: `BOAT_ANIMATION_${i}`,
		getStory: boatStory(vf, {x: -100, y: -100, scale: 0.2}, {x: -10, y: -10, scale: 0.2}),
		getChildrenIterator: function*() {}
	})

mangler.addStory(calc.addSegment(10, 10), vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_INIT",
	getStory: slideStory(vf, {s: "SLIDE_CLUSTERS_INTRO"}, {scale: 0.65}),
	getChildrenIterator: function*() {}
})
mangler.addStory(calc.addSegment(10), vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_NORWAY",
	getStory: slideStory(vf, {s: "SLIDE_NORWAY_INTRO"}, slideSideCommonProps),
	getChildrenIterator: function*() {}
})
const norwaySecondStepSegment = calc.addSegment(10)
mangler.addStory(norwaySecondStepSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_NORWAY_2",
	getStory: slideStory(vf, {s: "SLIDE_NORWAY_OIL"}, slideSideCommonProps),
	getChildrenIterator: function*() {}
})
for (const i of Ix.Iterable.range(0, 5))
	mangler.addStory(norwaySecondStepSegment, vf => <IStoryRunnerProvider>{
		id: `RIG_ANIMATION_${i}`,
		getStory: oilRigStory(vf, {x: -100, y: -100, scale: 0.2}, {x: -10, y: -10, scale: 0.2}),
		getChildrenIterator: function*() {}
	})


const intermesso1Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso1Segment, fullscreenMapFunc)

const detroitIntroSegment = calc.addSegment(10)
const detroitDetailSegment = calc.addSegment(10)
mangler.addStory(detroitIntroSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_DETROIT",
	getStory: mapStory(vf, {selectedHotspot: 0, closeness: "FAR"}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(detroitDetailSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_DETROIT_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 0, closeness: "CLOSE"}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(detroitIntroSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_DETROIT",
	getStory: slideStory(vf, {s: "SLIDE_DETROIT_INTRO"}, slideSideCommonProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(detroitDetailSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_DETROIT_2",
	getStory: slideStory(vf, {s: "SLIDE_DETROIT_DETAIL"}, slideSideCommonProps),
	getChildrenIterator: function*() {}
})

const intermesso2Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso2Segment, fullscreenMapFunc)

const shenzhenIntroSegment = calc.addSegment(10)
const shenzhenDetailSegment = calc.addSegment(10)

mangler.addStory(shenzhenIntroSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_SHENZHEN",
	getStory: mapStory(vf, {selectedHotspot: 2, closeness: "FAR"}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(shenzhenDetailSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_SHENZHEN_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 2, closeness: "CLOSE"}, upcloseMapProps),
	getChildrenIterator: function*() {}
})
mangler.addStory(shenzhenIntroSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_SHENZHEN",
	getStory: slideStory(vf, {s: "SLIDE_SHENZHEN_INTRO"}, slideSideCommonProps),
	getChildrenIterator: function*() {}
})

mangler.addStory(shenzhenDetailSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_SHENZHEN",
	getStory: slideStory(vf, "Now everyone buys stuff from Shenzhen.", slideSideCommonProps),
	getChildrenIterator: function*() {}
})

const intermesso3Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso3Segment, fullscreenMapFunc)

// Add the progress indicator, for this to work all segments must be added to the calculator.
mangler.addStory(calc.addSegment(-1, 0), vf => <IStoryRunnerProvider>{
	id: "PROGRESS_INDICATOR",
	getStory: progressIndicator(mangler.getSegmentMetas().
					map(x => x.startPos).
					reduce((x, y) => x.findIndex(z => z === y) > -1 ? x : [...x, y], []), {x: 130, y: -110, scale: 0.25}),
	getChildrenIterator: function*() {}
})

const storySelector = mangler.getStorySelector()

export const clusterStorySetup: IStoryRunnerProvider = {
	id: rootStoryId,
	getStory: clusterStories,
	getChildrenIterator: function*() {
		let state: IStoryRunnerChildrenStatus = yield null
		while (true) {
			const newStories =
				filterChildren(storySelector(state.eventState), state.running)
			state = yield newStories
		}
	},
}


// Use the same method to trigger the stories, as is passed to the story (start / end)
// Refactor to get optimal layout.
// Still needs to make sure objects are not whiped out when they are still present in the scene (ref counter in redux)