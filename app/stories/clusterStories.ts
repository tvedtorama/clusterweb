import { IStoryRunnerProvider, IStoryRunnerChildrenStatus, IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { NOP } from "../../storyAnim/actions/nop";
import { storeStoryItem } from "../../storyAnim/actions/storyItem";
import { CONTAINER_COMPONENT } from "../../storyAnim/components/Container";
import { ROOT_STORY_ID } from "../../storyAnim/storySupport/rootStory";
import { filterChildren } from "../../storyAnim/storySupport/filterChildren";
import { IWorldMapProps } from "../components/story/WorldMap";
import { StorySegmentCalculator } from "../../storyAnim/storySupport/StorySegmentCalculator";

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

export const mapFullscreenStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, selectedHotspot: number = null, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*(initialState: StoryAnim.IEventState) {
	yield storeStoryItem({
		position,
		...commonChildProps("THE_MAP"),
		visual: {
			component: "MAP",
			props: <IWorldMapProps>{selectedHotspot}
		}
	})
	while (true) {
		const state: IStoryRunnerYieldFormat = yield {type: NOP}
		if (!existenceCheck(state.eventState))
			return
	}
}

export const slideStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, slideText: string, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*(initialState: StoryAnim.IEventState) {
		console.log(`slide started ${initialState.pos}`)
		yield storeStoryItem({
			position,
			...commonChildProps("THE_SLIDE"),
			visual: {
				component: "SLIDE",
				props: {text: slideText},
			}
		})
		while (true) {
			const state: IStoryRunnerYieldFormat = yield {type: NOP}
			if (!existenceCheck(state.eventState))
				return
		}
	}

const calc = new StorySegmentCalculator()
const mapsInitSeg = calc.addSegment(20)
const mapsNorwaySeg = calc.addSegment(10)
const slideDeckInitSeg = calc.addSegment(10, 10)
const slideDeckNorwaySeg = calc.addSegment(10)

const mapsInitFunc = mapsInitSeg.validFunc()
const mapsNorwayFunc = mapsNorwaySeg.validFunc()
const slideDeckInitFunc = slideDeckInitSeg.validFunc()
const slideDeckNorwayFunc = slideDeckNorwaySeg.validFunc()

export const clusterStorySetup: IStoryRunnerProvider = {
	id: rootStoryId,
	getStory: clusterStories,
	getChildrenIterator: function*() {
		let state: IStoryRunnerChildrenStatus = yield null
		while (true) {
			const newStories =
				filterChildren([
					mapsInitFunc(state.eventState) ? <IStoryRunnerProvider>{
						id: "MAPS_INIT",
						getStory: mapFullscreenStory(mapsInitFunc),
						getChildrenIterator: function*() {}
					} : mapsNorwayFunc(state.eventState) ? <IStoryRunnerProvider>{
						id: "MAPS_NORWAY",
						getStory: mapFullscreenStory(mapsNorwayFunc, 1, {x: -35, scale: 0.40}),
						getChildrenIterator: function*() {}
					} : null,
					slideDeckInitFunc(state.eventState) ? <IStoryRunnerProvider>{
						id: "SLIDE_DECK_INIT",
						getStory: slideStory(slideDeckInitFunc, "The world is full of industrial clusters, ...", {scale: 0.65}),
						getChildrenIterator: function*() {}
					} : slideDeckNorwayFunc(state.eventState) ? <IStoryRunnerProvider>{
						id: "SLIDE_DECK_NORWAY",
						getStory: slideStory(slideDeckNorwayFunc, "Norway is fortunate enough to have an ocean full of fish...", {x: 18, scale: 0.65}),
						getChildrenIterator: function*() {}
					} : null,
				], state.running)
			state = yield newStories
		}
	},
}


// Use the same method to trigger the stories, as is passed to the story (start / end)
// Refactor to get optimal layout.
// Still needs to make sure objects are not whiped out when they are still present in the scene (ref counter in redux)