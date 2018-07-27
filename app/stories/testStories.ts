import { STORE_STORY_ITEM, storeStoryItem } from "../../storyAnim/actions/storyItem";
import { NOP } from "../../storyAnim/actions/nop";
import { storyMainLoop } from "../../storyAnim/storySupport/storyMainLoop";
import { IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { ROOT_STORY_ID } from "../../storyAnim/storySupport/rootStory";
import { IWorldMapProps } from "../components/story/WorldMap";

export interface ITestStoryProps {
	propText: string
}

export const rootStoryId = "ALMOST_ROOT"
export const commonProps = {id: rootStoryId, parentId: ROOT_STORY_ID}

export const rootStory = function*(initialState: StoryAnim.IEventState) {
	const startLoop = function*(initialState: StoryAnim.IEventState) {
		const yielder = function*(eventPack?: IStoryRunnerYieldFormat) {
			return yield storeStoryItem({
					position: {x: 10, y: 20, z: 40, scale: 0.5},
					...commonProps,
					visual: {
						component: "GOAT",
						props: <ITestStoryProps>{propText: `Gee ${eventPack.eventState.pos}`}
					}
				})
		}
		let eventData: IStoryRunnerYieldFormat = {eventState: initialState, eventData: null};
		while (true) {
			eventData = yield* yielder(eventData)
		}
	}
	const finalLoop = function*() {
		yield storeStoryItem({
				position: {x: 15, y: 50, z: 40, scale: 0.5},
				...commonProps,
				visual: {
					component: "HORSE",
					props: <ITestStoryProps>{propText: "Hoo"}
				}
			})
	}
	const findNextGenerator = (pos: number) => pos < 20 ? init : pos < 30 ? startLoop : pos < 50 ? finalLoop : null
	const conditionallyFindNextIterator = (eventPack: IStoryRunnerYieldFormat, defaultIterator) => findNextGenerator(eventPack.eventState.pos) || defaultIterator
	const init = function*(initialState: StoryAnim.IEventState) {
		let state = initialState
		let lastMoveOn = 'INIT'
		while (true) {
			const moveOn = state && state.pos > 3
			const moveOnFunc = () => moveOn.toString()
			const update: IStoryRunnerYieldFormat = yield lastMoveOn === moveOnFunc() ?
				{type: NOP} :
				storeStoryItem({
					position: {rotateX: moveOn ? 55 : 0}, // scale: moveOn ? 18 : 1 uncool on safari // {x: moveOn ? -120 : 0, y: moveOn ? 750 : 0, z: 40, scale: moveOn ? 18 : 1.5, rotateX: moveOn ? 55 : 0},
					...commonProps,
					visual: {
						component: "MAP",
						props: <IWorldMapProps>{selectedHotspot: moveOn ? 1 : undefined}
					}
				})
			state = update.eventState
			lastMoveOn = moveOnFunc()
		}
	}

	yield* storyMainLoop(init, initialState, conditionallyFindNextIterator)
}

export const childStoryGen = (existRange: [number, number], parentId) =>
	function*() {
		yield storeStoryItem({
				position: {x: 150, y: 0, z: 40, scale: 0.5},
				parentId,
				id: "Bacalao",
				visual: {
					component: "BACALAO",
					props: <ITestStoryProps>{propText: "HOBLA"}
				}
			})
		while (true) {
			const state: IStoryRunnerYieldFormat = yield {type: NOP}
			if (state.eventState.pos < existRange[0] || state.eventState.pos > existRange[1])
				return
		}
	}

// We got stories now
// We need to clean up the stories' acts
// We need a D3 map
// DONE We need storyRunners
// POSTPONED / OBSOLETE? We need to test story main loop
// DONE We need to test story runners
// We need to figure out when to start new stories.
//    We need a list of story concepts, then start them when entering their frame.  When they exit - mark them.
// DONE We need a reducer for the storyItems to create and delete
// We might need a reducer to update an item, instead of overwriting
// We can't use svg all the way, becuase it does not support 3d transforms.
//   Must instead use layered divs, with svgs inside them.  The backgrounds should be spaced.

