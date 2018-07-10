export const SET_STORY_DATA = "SET_STORY_DATA"
export const NOP = "NOP"

type IEventData = {
	type: "SCROLL_POS",
	pos: number,	
} | {
	type: "TIME",
	elapsed: number,
}

export const rootStory = function*() {
	const id = "abc123"
	const startLoop = function*() {
		yield {
			type: SET_STORY_DATA, 
			position: {x: 10, y: 20, z: 40, scale: 0.5},
			id,
		}
	}
	const finalLoop = function*() {
		yield {
			type: SET_STORY_DATA, 
			position: {x: 15, y: 5, z: 40, scale: 0.8},
			id,
		}
	}
	const findNextGenerator = (pos: number) => pos < 20 ? startLoop : pos < 50 ? finalLoop : null
	const conditionallyFindNextIterator = (eventData: IEventData, defaultIterator) => eventData.type === "SCROLL_POS" && findNextGenerator(eventData.pos) || defaultIterator
	const init = function*() {
		yield {
			type: SET_STORY_DATA, 
			id,
			itemDef: "BALL",
			itemProps: {}}	
	}

	yield* storyMainLoop(init, conditionallyFindNextIterator)
}

// We got stories now
// We need storyRunners
// We need to test story main loop
// We need to test story runners
// We need to figure out when to start new stories.
//    We need a list of story concepts, then start them when entering their frame.  When they exit - mark them.

type ISubStory = () => IterableIterator<any>

export const storyMainLoop = function*(init: ISubStory, conditionallyFindNextIterator: (ed: IEventData, iterator: ISubStory) => ISubStory = (_, iterator) => iterator) {
	let iterator = init

	while (iterator) {
		const yieldAndCheckIterator = function*(yieldThings) {
			const eventData = yield yieldThings
			const nextIterator = conditionallyFindNextIterator(eventData, iterator)
			return {eventData, nextIterator}
		}
		const runGenerator = function*() {
			const gen = iterator()
			let eventData: IEventData = null
			while (true) {
				const result = gen.next(eventData)
				const {eventData: nextEventData, nextIterator} = yield* yieldAndCheckIterator(result.done ? {type: NOP} : result.value)
				if (result.done || nextIterator !== iterator) {
					return nextIterator
				}
				eventData = nextEventData
			}
		}
		let nextIterator = yield* runGenerator()
		while (nextIterator === iterator) {
			const {nextIterator: nextNextIterator} = yield* yieldAndCheckIterator({type: NOP})
			nextIterator = nextNextIterator
		}
		iterator = nextIterator
	}
}
