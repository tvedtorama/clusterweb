import { NOP } from "../actions/nop";

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
			// Issue: Should have eventData here, and pass it to the generator - or rather eventState, which should be read from redux - eliminating all the mutability issues around here
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
