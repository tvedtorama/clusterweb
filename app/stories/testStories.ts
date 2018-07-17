import { STORE_STORY_ITEM, storeStoryItem } from "../../storyAnim/actions/storyItem";
import { NOP } from "../../storyAnim/actions/nop";
import { storyMainLoop } from "../../storyAnim/storySupport/storyMainLoop";
import { IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { ROOT_STORY_ID } from "../../storyAnim/storySupport/rootStory";

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
	const findNextGenerator = (pos: number) => pos < 20 ? startLoop : pos < 50 ? finalLoop : null
	const conditionallyFindNextIterator = (eventPack: IStoryRunnerYieldFormat, defaultIterator) => findNextGenerator(eventPack.eventState.pos) || defaultIterator
	const init = function*() {
		yield storeStoryItem({
				position: {x: 0, y: 0, z: 40, scale: 0.5},
				...commonProps,
				visual: {
					component: "MAP",
					props: <ITestStoryProps>{propText: "Boo"}
				}
			})
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

