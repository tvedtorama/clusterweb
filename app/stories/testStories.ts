import { STORE_STORY_ITEM } from "../../storyAnim/actions/storyItem";
import { NOP } from "../../storyAnim/actions/nop";
import { storyMainLoop } from "../../storyAnim/storySupport/storyMainLoop";

export interface ITestStoryProps {
	propText: string
}

export const rootStory = function*() {
	const id = "ROOT"
	const startLoop = function*() {
		const yielder = function*(eventData?: StoryAnim.IEventData) {
			return yield {
				type: STORE_STORY_ITEM,
				payload: <StoryAnimDataSchema.IStoryItem>{
					position: {x: 10, y: 20, z: 40, scale: 0.5},
					id,
					visual: {
						component: "GOAT",
						props: <ITestStoryProps>{propText: `Gee ${eventData && eventData.type === "SCROLL_POS" ? eventData.pos : "N/A"}`}
					}
				}
			}
		}
		let eventData = null;
		while (true) {
			eventData = yield* yielder(eventData)
		}
	}
	const finalLoop = function*() {
		yield {
			type: STORE_STORY_ITEM,
			payload: <StoryAnimDataSchema.IStoryItem>{
				position: {x: 15, y: 22, z: 40, scale: 0.5},
				id,
				visual: {
					component: "HORSE",
					props: <ITestStoryProps>{propText: "Hoo"}
				}
			}
		}
	}
	const findNextGenerator = (pos: number) => pos < 20 ? startLoop : pos < 50 ? finalLoop : null
	const conditionallyFindNextIterator = (eventData: StoryAnim.IEventData, defaultIterator) => eventData.type === "SCROLL_POS" && findNextGenerator(eventData.pos) || defaultIterator
	const init = function*() {
		yield {
			type: STORE_STORY_ITEM,
			payload: <StoryAnimDataSchema.IStoryItem>{
				position: {x: 10, y: 20, z: 40, scale: 0.5},
				id,
				visual: {
					component: "BALL",
					props: <ITestStoryProps>{propText: "Boo"}
				}
			}
		}
	}

	yield* storyMainLoop(init, conditionallyFindNextIterator)
}

// We got stories now
// DONE We need storyRunners
// We need to test story main loop
// DONE We need to test story runners
// We need to figure out when to start new stories.
//    We need a list of story concepts, then start them when entering their frame.  When they exit - mark them.
// We need to clean up the stories' acts
// DONE We need a reducer for the storyItems to create and delete
// We might need a reducer to update an item, instead of overwriting
// We can't use svg all the way, becuase it does not support 3d transforms.
//   Must instead use layered divs, with svgs inside them.  The backgrounds should be spaced.

