import { STORE_STORY_ITEM } from "../../storyAnim/actions/storyItem";
import { NOP } from "../../storyAnim/actions/nop";

export const rootStory = function*() {
	const id = "ROOT"
	const startLoop = function*() {
		yield {
			type: STORE_STORY_ITEM,
			payload: <StoryAnimDataSchema.IStoryItem>{
				position: {x: 10, y: 20, z: 40, scale: 0.5},
				id,
				visual: {
					component: "GOAT",
					props: {}
				}
			}
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
					props: {}
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
					props: {}
				}
			}
		}
	}

	yield* storyMainLoop(init, conditionallyFindNextIterator)
}

// We got stories now
// We need storyRunners
// We need to test story main loop
// We need to test story runners
// We need to figure out when to start new stories.
//    We need a list of story concepts, then start them when entering their frame.  When they exit - mark them.
// We need to clean up the stories' acts
// We need a reducer for the storyItems to create and delete

type ISubStory = () => IterableIterator<any>
type IConditionallyFindNextIterator = (ed: StoryAnim.IEventData, iterator: ISubStory) => ISubStory

export const storyMainLoop = function*(init: ISubStory, conditionallyFindNextIterator: IConditionallyFindNextIterator = (_, iterator) => iterator) {
	let iterator = init

	while (iterator) {
		const yieldAndCheckIterator = function*(yieldThings, iterator: ISubStory) {
			const eventData = yield yieldThings
			const nextIterator = conditionallyFindNextIterator(eventData, iterator)
			return {eventData, nextIterator}
		}
		const runGenerator = function*(iterator: ISubStory) {
			const gen = iterator()
			let eventData: StoryAnim.IEventData = null
			while (true) {
				const result = gen.next(eventData)
				const {eventData: nextEventData, nextIterator} =
					yield* yieldAndCheckIterator(result.done ?
						{type: NOP} :
						result.value, iterator)
				if (nextIterator !== iterator) {
					return nextIterator
				}
				eventData = nextEventData
			}
		}
		iterator = yield* runGenerator(iterator)
	}
}
