import { take, fork, cancel, put } from "redux-saga/effects";
import { SET_EVENT_DATA } from "./actions/eventData";
import { Task } from "redux-saga";
import * as Ix from 'ix'
import { Action } from "redux";

type IChildrenIterator = IterableIterator<IStoryRunnerProvider[]>
type IEventDataAction = Action & {eventData: StoryAnim.IEventData}

export interface IStoryRunnerProvider {
	id: string
	getStory: () => IterableIterator<any>
	/** Returns missing children for the given status, taking a `IStoryRunnerChildrenStatus`.  Should perhps be a
	 * regular function, unless we want to make sure some children are created only once. */
	getChildrenIterator: () => IChildrenIterator
}
export interface IStoryRunnerChildrenStatus {
	running: string[]
	eventData: StoryAnim.IEventData
}

/** Returns something like an action with event data, either from input data or by taking one from redux */
const produceYieldableEventData = function*(eventData?: StoryAnim.IEventData) {
	if (eventData)
		yield Promise.resolve(<IEventDataAction>{eventData})
	while (true) {
		yield take(SET_EVENT_DATA)
	}
}

const getActualRunningChildren = (runningIterators: {[id: string]: Task}) =>
	Object.keys(runningIterators).filter(k => runningIterators[k].isRunning())

/** Calls the children iteratior, two times the first time, to initialize it.
 *
 * Note: We might be better off using a plain function as mentioned somewhere else
 * Note: When done, we get `value === undefined`
 */
const iterateChildrenLister = (childIterator: IChildrenIterator, childrenStatus: IStoryRunnerChildrenStatus, isFirst: boolean): IStoryRunnerProvider[] =>
	Ix.Iterable.range(0, isFirst ? 2 : 1).reduce(() => childIterator.next(childrenStatus).value, []) || []

/** Runs a story and its children. `put`s any actions it dispatches. */
export const storyRunner = function*(storyData: IStoryRunnerProvider, eventData?: StoryAnim.IEventData) {
	const gen = storyData.getStory()
	const childIterator = storyData.getChildrenIterator()
	const eventDataGenerator = produceYieldableEventData(eventData)
	let runningChildren: {[id: string]: Task} = {}
	for (const iteration of Ix.Iterable.range(0, Number.MAX_SAFE_INTEGER)) {
		const {eventData}: IEventDataAction = yield eventDataGenerator.next().value
		const childrenStatus = {
			running: getActualRunningChildren(runningChildren),
			eventData,
		}
		const newChildren = iterateChildrenLister(childIterator, childrenStatus, iteration === 0)
		for (const child of newChildren)
			runningChildren = {
				...runningChildren,
				[child.id]: yield fork(storyRunner, child, eventData)
			}
		const result = gen.next(eventData)
		if (result.done) {
			const running = getActualRunningChildren(runningChildren)
			for (const cancelId of running)
				yield cancel(running[cancelId])
			return
		}
		yield put(result.value)
	}
}
