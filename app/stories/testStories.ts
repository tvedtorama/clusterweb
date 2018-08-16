import { storeStoryItem, ROOT_STORY_ID, IStoryRunnerYieldFormat, NOP, IStoryRunnerChildrenStatus, IStoryRunnerProvider, filterChildren } from "saga-stories";
import { IWorldMapProps } from "../components/story/WorldMap";
import { storyMainLoop } from "../../build/storyAnim/storySupport/storyMainLoop";

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
	const findNextGenerator = (pos: number) => pos < 5 ? init : pos < 20 ? init2 : pos < 30 ? startLoop : pos < 50 ? finalLoop : null
	const conditionallyFindNextIterator = (eventPack: IStoryRunnerYieldFormat, defaultIterator) => findNextGenerator(eventPack.eventState.pos) || defaultIterator
	const init = function*() {
		yield storeStoryItem({
			position: {},
			...commonProps,
			visual: {
				component: "MAP",
				props: <IWorldMapProps>{}
			}
		})

		while (true) {
			yield {type: NOP}
		}
	}
	const init2 = function*() {
		yield storeStoryItem({
			position: {rotateX: 50, scale: 0.45, x: -25},
			...commonProps,
			visual: {
				component: "MAP",
				props: <IWorldMapProps>{selectedHotspot: 1}
			}
		})
		// ATW, this component will not be removed until the main story exists (never).
		yield storeStoryItem({
			position: {x: 25, scale: 0.45},
			...commonProps,
			id: "SLIDE",
			visual: {
				component: "SLIDE",
				props: <IWorldMapProps>{text: "hei"}
			}
		})

		while (true) {
			yield {type: NOP}
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

const parentId = "ROOT"

export const storySetup: IStoryRunnerProvider = {
	id: parentId,
	getStory: rootStory,
	getChildrenIterator: function*() {
		let state: IStoryRunnerChildrenStatus = yield null
		while (true) {
			const newStories =
				filterChildren([
					state.eventState.pos > 40 && state.eventState.pos < 60 ? <IStoryRunnerProvider>{
						id: "Bacalao",
						getStory: childStoryGen([40, 70], parentId),
						getChildrenIterator: function*() {}
					} : null
				], state.running)
			state = yield newStories
		}
	},
}

// We got stories now
// We need smart coordinates when moving things around
// Need to use regular stories, with children, not this simple wrap up - as we want things to disappear when not in the story anymore.
// We want to show a presentation box with text and bullet points when zooming in on the action points
//    Move the map somewhat, scale and translate
//    Show the presentation, which is html (or does it have to be svg?)
// We might need a reducer to update an item, instead of overwriting
// We might want to shift to a limited-country high res version when zooming the world map
//   Simply brute force filter high res countries and use that model when the zoom moves past a given threshold
//   Animations are smooths when every third country is removed
// The world map is visiable all the time (?). Should it have its own story? Can we have more than one? Can another story inherit the first?
//    Do not clean up a storyItem that is also present in a new story, or is there any way around it?
// ??? We need to figure out when to start new stories.
//    We need a list of story concepts, then start them when entering their frame.  When they exit - mark them.
// DONE We need a reducer for the storyItems to create and delete
// DONE We need to clean up the stories' acts
// DONE We need a D3 map
// DONE We need storyRunners
// POSTPONED / OBSOLETE? We need to test story main loop
// DONE We need to test story runners
// DONE We can't use svg all the way, becuase it does not support 3d transforms.
//     Must instead use layered divs, with svgs inside them.  The backgrounds should be spaced.
