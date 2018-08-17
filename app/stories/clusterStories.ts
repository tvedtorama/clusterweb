// Note: For some reason, when targeting the ts ix package, it went for the one in saga-stories.
import Ix from "@reactivex/ix-es2015-esm/Ix";
import { IStoryRunnerProvider, IStoryRunnerChildrenStatus,
	NOP, storeStoryItem, ROOT_STORY_ID, slideStoryImpl,
	StorySegmentCalculator, StoryComposer, filterChildren, progressIndicator } from "saga-stories";
import { CONTAINER_COMPONENT } from "saga-stories/components";
import { boatStory } from "./boatStory";
import { oilRigStory } from "./oilRigStory";
import { valueNetworkStoryImpl, valueNetworkWorldMapStoryProvider } from "./valueNetworkStory";
import { mapStoryImpl } from "./worldMapStory";
import { ISlideKey } from "../components/slides";

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


export const slideStory = slideStoryImpl<ISlideKey>(commonChildProps("THE_SLIDE"))
export const valueNetworkStory = valueNetworkStoryImpl(commonChildProps("THE_SLIDE"))
export const mapStory = mapStoryImpl(commonChildProps("THE_MAP"))

const fullscreenMapFunc = vf => <IStoryRunnerProvider>{
	id: "MAPS_INIT",
	getStory: mapStory(vf),
}

const upcloseMapProps = {x: -95, scale: 0.40, rotateX: 0}
const slideSideCommonProps = {x: 25, scale: 0.65}

const calc = new StorySegmentCalculator()
const mangler = new StoryComposer()
const intermessoLength = 5
mangler.addStory(calc.addSegment(30), fullscreenMapFunc)
const norwayFirstStepSegment = calc.addSegment(10)
mangler.addStory(norwayFirstStepSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_NORWAY",
	getStory: mapStory(vf, {selectedHotspot: 1}, upcloseMapProps),
})
mangler.addStory(calc.addSegment(10), vf => <IStoryRunnerProvider>{
	id: "MAPS_NORWAY_VERY_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 1, closeness: "VERY_CLOSE"}, upcloseMapProps),
})
// Create boat animations - these time out and are recreated.  The stories have an inherent rotation and delay.
for (const i of Ix.Iterable.range(0, 5))
	mangler.addStory(norwayFirstStepSegment, vf => <IStoryRunnerProvider>{
		id: `BOAT_ANIMATION_${i}`,
		getStory: boatStory(vf, {x: -100, y: -100, scale: 0.2}, {x: -10, y: -10, scale: 0.2}),
	})

mangler.addStory(calc.addSegment(10, 10), vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_INIT",
	getStory: slideStory(vf, {s: "SLIDE_CLUSTERS_INTRO"}, {scale: 0.65}),
})

mangler.addStory(calc.addSegment(10, 20), vf => <IStoryRunnerProvider>{
	id: "VALUE_NETWORK_INIT",
	getStory: valueNetworkStory(vf, {scale: 0.65}),
})

mangler.addStory(calc.addSegment(10), vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_NORWAY",
	getStory: slideStory(vf, {s: "SLIDE_NORWAY_INTRO"}, slideSideCommonProps),
})
const norwaySecondStepSegment = calc.addSegment(10)
mangler.addStory(norwaySecondStepSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_NORWAY_2",
	getStory: slideStory(vf, {s: "SLIDE_NORWAY_OIL"}, slideSideCommonProps),
})

for (const i of Ix.Iterable.range(0, 5))
	mangler.addStory(norwaySecondStepSegment, vf => <IStoryRunnerProvider>{
		id: `RIG_ANIMATION_${i}`,
		getStory: oilRigStory(vf, {x: -100, y: -100, scale: 0.2}, {x: -10, y: -10, scale: 0.2}),
	})

const intermesso1Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso1Segment, fullscreenMapFunc)

const detroitIntroSegment = calc.addSegment(10)
const detroitDetailSegment = calc.addSegment(10)
mangler.addStory(detroitIntroSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_DETROIT",
	getStory: mapStory(vf, {selectedHotspot: 0, closeness: "FAR"}, upcloseMapProps),
})
mangler.addStory(detroitDetailSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_DETROIT_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 0, closeness: "CLOSE"}, upcloseMapProps),
})
mangler.addStory(detroitIntroSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_DETROIT",
	getStory: slideStory(vf, {s: "SLIDE_DETROIT_INTRO"}, slideSideCommonProps),
})
mangler.addStory(detroitDetailSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_DETROIT_2",
	getStory: slideStory(vf, {s: "SLIDE_DETROIT_DETAIL"}, slideSideCommonProps),
})

const intermesso2Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso2Segment, fullscreenMapFunc)

const shenzhenIntroSegment = calc.addSegment(10)
const shenzhenDetailSegment = calc.addSegment(10)

mangler.addStory(shenzhenIntroSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_SHENZHEN",
	getStory: mapStory(vf, {selectedHotspot: 2, closeness: "FAR"}, upcloseMapProps),
})
mangler.addStory(shenzhenDetailSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_SHENZHEN_CLOSE",
	getStory: mapStory(vf, {selectedHotspot: 2, closeness: "CLOSE"}, upcloseMapProps),
})
mangler.addStory(shenzhenIntroSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_SHENZHEN",
	getStory: slideStory(vf, {s: "SLIDE_SHENZHEN_INTRO"}, slideSideCommonProps),
})

mangler.addStory(shenzhenDetailSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_SHENZHEN_DETAILS",
	getStory: slideStory(vf, {s: "SLIDE_SHENZHEN_DETAIL"}, slideSideCommonProps),
})

const intermesso3Segment = calc.addSegment(intermessoLength)
mangler.addStory(intermesso3Segment, fullscreenMapFunc)

const enterPhilSegment = calc.addSegment(10)
const enterPhilWorldMapSegment = calc.addSegment(10)
const philFeaturesSegment = calc.addSegment(15)

mangler.addStory(enterPhilSegment, vf => <IStoryRunnerProvider>{
	id: "MAPS_PHIL",
	getStory: mapStory(vf, {}, upcloseMapProps),
})

mangler.addStory(enterPhilSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_PHIL",
	getStory: slideStory(vf, {s: "SLIDE_ENTER_PHIL"}, slideSideCommonProps),
})

mangler.addStory(enterPhilWorldMapSegment, vf =>
	valueNetworkWorldMapStoryProvider(() => mapStory(vf)))

mangler.addStory(enterPhilWorldMapSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_EXTEND_NETWORK",
	getStory: slideStory(vf, {s: "SLIDE_EXTEND_YOUR_NETWORK"}, {...slideSideCommonProps, x: 50, y: 40}, true),
})
mangler.addStory(philFeaturesSegment, vf => <IStoryRunnerProvider>{
	id: "SLIDE_DECK_FEATURES",
	getStory: slideStory(vf, {s: "SLIDE_PHIL_FETAURES"}, {scale: 0.65}),
})

// Add the progress indicator, for this to work all segments must be added to the calculator.
mangler.addStory(calc.addSegment(-1, 0), vf => <IStoryRunnerProvider>{
	id: "PROGRESS_INDICATOR",
	getStory: progressIndicator(mangler.getSegmentMetas().
					map(x => x.startPos).
					reduce((x, y) => x.findIndex(z => z === y) > -1 ? x : [...x, y], []), {x: 150, y: -95, scale: 0.35}),
})

const storySelector = mangler.getStorySelector()

/** Root story for the cluster stories, launches the main story elements as children.  */
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
