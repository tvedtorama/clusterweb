import { take, fork, cancel, put, select, actionChannel } from "redux-saga/effects";
import { SET_EVENT_DATA } from "./actions/eventData";
import { Task, delay } from "redux-saga";
import * as Ix from 'ix'
import { Action } from "redux";
import { deleteStoryItem, STORE_STORY_ITEM, IStoreStoryItemAction, DELETE_STORY_ITEM } from "./actions/storyItem";
import { NOP } from "./actions/nop";
import { CreatedItemRegistry } from "./utils/CreatedItemsRegistry";

export interface IStoryRunnerYieldFormat {
	eventData: StoryAnim.IEventData
	eventState: StoryAnim.IEventState
}

type IChildrenIterator = IterableIterator<IStoryRunnerProvider[]>
type IEventDataAction = Action & {eventData: StoryAnim.IEventData}
type IStoryIterator =  IterableIterator<any>

export interface IStoryRunnerProvider {
	id: string
	getStory: (es: StoryAnim.IEventState) => IStoryIterator
	/** Returns missing children for the given status, taking a `IStoryRunnerChildrenStatus`.  Should perhps be a
	 * regular function, unless we want to make sure some children are created only once. */
	getChildrenIterator: () => IChildrenIterator
}
export interface IStoryRunnerChildrenStatus {
	running: string[]
	eventState: StoryAnim.IEventState
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

/** This is used around the place since generators don't receive anything until they yield,
 * hence we have to call it twice on first iteration. **Bad stuff!** */
const takeTwoOnFirst = (isFirst) => Ix.Iterable.range(0, isFirst ? 2 : 1)

/** Calls the children iteratior, two times the first time, to initialize it.
 *
 * Note: We might be better off using a plain function as mentioned somewhere else
 * Note: When done, we get `value === undefined`
 */
const iterateChildrenLister = (childIterator: IChildrenIterator, childrenStatus: IStoryRunnerChildrenStatus, isFirst: boolean): IStoryRunnerProvider[] =>
	takeTwoOnFirst(isFirst).reduce(() => childIterator.next(childrenStatus).value, []) || []

/** Return the story when yielded. This requires the eventState, which is passed in after yield. Hence it
 * will initially yield empty, to get this state.
 * All this to achieve immutability in the main loop. */
const getStoryWhenItsTime = function*(storyData: IStoryRunnerProvider): IterableIterator<IStoryIterator> {
		const eventState: StoryAnim.IEventState = yield null
		const gen = storyData.getStory(eventState)
		while (true)
			yield gen
	}

const isAction = (a: Partial<Action>): a is Action => a && a.type ? true : false
const isStoreAction = (a: Action): a is IStoreStoryItemAction => a.type === STORE_STORY_ITEM
const isDeleteAction = (a: Action): a is IStoreStoryItemAction => a.type === DELETE_STORY_ITEM

/** Runs a story and its children. `put`s any actions it dispatches.
 *
 * Issues:
 *  * Stories have to filter children, move to storyRunner
 *  * It's cumbersome to track state with the object yields (maybe two different yields, one for fetching state (wait) and one for adding objects?)
 *  * Stories must keep track of their running time
 *  * Stories must yield `NOP`s to stay avake, should just `yield staylAlive()` or `yield hangAroundUntil(func)`
*/
export const storyRunner = function*(storyData: IStoryRunnerProvider, eventData?: StoryAnim.IEventData, itemRegistryInput?: CreatedItemRegistry) {
	const itemRegistry = itemRegistryInput || new CreatedItemRegistry()
	const genIterator = getStoryWhenItsTime(storyData)
	const childIterator = storyData.getChildrenIterator()
	const eventDataGenerator = produceYieldableEventData(eventData)
	const actionOwners = {owners: [storyData.id]}
	let runningChildren: {[id: string]: Task} = {}
	for (const iteration of Ix.Iterable.range(0, Number.MAX_SAFE_INTEGER)) {
		const isFirstIteration = iteration === 0
		const {eventData}: IEventDataAction = yield eventDataGenerator.next().value
		const {eventState}: StoryAnimState.IState = yield select()
		const childrenStatus = {
			running: getActualRunningChildren(runningChildren),
			eventState,
		}
		const newChildren = iterateChildrenLister(childIterator, childrenStatus, isFirstIteration)
		// Todo: Move filtering of children here, it does not make sense to overwrite an existing story, without first deleting the running one
		for (const child of newChildren)
			runningChildren = {
				...runningChildren,
				[child.id]: yield fork(storyRunner, child, eventData, itemRegistry.createAndRegisterChild(child.id))
			}
		const gen = takeTwoOnFirst(isFirstIteration).map(i => genIterator.next(eventState).value).last()
		const result = gen.next(<IStoryRunnerYieldFormat>{eventState, eventData})
		if (result.done) {
			const running = getActualRunningChildren(runningChildren)
			for (const cancelId of running)
				yield cancel(runningChildren[cancelId])
			break
		}
		if (isAction(result.value) && result.value.type !== NOP) {
			// Note: result.value should always be an action, the above test is mostly a type guard
			let action = result.value
			if (isStoreAction(action)) {
				itemRegistry.registerSet(action.payload.id)
				action = <IStoreStoryItemAction>{...action, payload: {...action.payload, ...actionOwners}}
			} else if (isDeleteAction(action))
				itemRegistry.registerDelete(action.payload.id)
			yield put(action)
		}
	}

	yield delay(0)

	// Remove any items crated by this story, and any cancelled child stories
	for (const activeItem of itemRegistry.getAllActive(storyData.id))
		yield put(deleteStoryItem({id: activeItem.itemId, owners: [activeItem.storyId]}))
}
