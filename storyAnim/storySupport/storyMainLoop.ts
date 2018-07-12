import { NOP } from "../actions/nop";
import { IStoryRunnerYieldFormat } from "../storyRunner";

type ISubStory = (es: StoryAnim.IEventState) => IterableIterator<any>
type IConditionallyFindNextIterator = (ed: IStoryRunnerYieldFormat, iterator: ISubStory) => ISubStory
type IYieldAndCheckIteratorResult = {nextEventPack: IStoryRunnerYieldFormat, nextIterator: ISubStory}

/** Runs a current story and allows it to be swapped for other stories.
 * Note: This is somewhat duplicate of the logic provided by the children list of storyRunner, and the functionality should be skipped
 */
export const storyMainLoop = function*(init: ISubStory, initialState: StoryAnim.IEventState,
					conditionallyFindNextIterator: IConditionallyFindNextIterator = (_, iterator) => iterator) {

	let iterator = init
	let state = initialState

	while (iterator) {
		const yieldAndCheckIterator = function*(yieldThings, iterator: ISubStory) {
			const nextEventPack: IStoryRunnerYieldFormat = yield yieldThings
			const nextIterator = conditionallyFindNextIterator(nextEventPack, iterator)
			return <IYieldAndCheckIteratorResult>{nextEventPack, nextIterator}
		}
		const runGenerator = function*(iterator: ISubStory, initialState: StoryAnim.IEventState) {
			// Issue: Should have eventData here, and pass it to the generator - or rather eventState, which should be read from redux - eliminating all the mutability issues around here
			const gen = iterator(initialState)
			let eventPack: IStoryRunnerYieldFormat = null
			while (true) {
				const result = gen.next(eventPack)
				const {nextEventPack, nextIterator}: IYieldAndCheckIteratorResult =
					yield* yieldAndCheckIterator(result.done ?
						{type: NOP} :
						result.value, iterator)
				if (nextIterator !== iterator) {
					return {nextIterator, nextEventPack}
				}
				eventPack = nextEventPack
			}
		}
		const {nextIterator, nextEventPack}: {nextIterator, nextEventPack: IStoryRunnerYieldFormat} = yield* runGenerator(iterator, state)
		iterator = nextIterator
		state = nextEventPack.eventState
	}
}
