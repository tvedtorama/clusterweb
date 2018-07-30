/// <reference path="../ISagaTester.d.ts" />

import * as chai from 'chai'
import SagaTester from 'redux-saga-tester'
import { delay } from 'redux-saga';
import { IStoryRunnerProvider, storyRunner, IStoryRunnerChildrenStatus, IStoryRunnerYieldFormat } from '../../storyAnim/storyRunner';
import { SET_EVENT_DATA } from '../../storyAnim/actions/eventData';
import { combineReducers } from 'redux';
import { storyAppReducers } from '../../storyAnim/reducers';
import { STORE_STORY_ITEM, DELETE_STORY_ITEM, deleteStoryItem } from '../../storyAnim/actions/storyItem';
import { NOP } from '../../storyAnim/actions/nop';

chai.should()

describe("storyRunner", () => {
	const startMeUp = () => {
		const initialState = {}
		const createSagaTester = (logger = (...args) => {}) => new SagaTester({initialState, reducers: combineReducers(storyAppReducers), options: {logger}})
		const tester = createSagaTester()
		return {tester}
	}

	it("should run the story and dispatch any actions it produces", async () => {
		const {tester} = startMeUp()

		const provider = <IStoryRunnerProvider>{
			id: "abc123",
			getStory: function*() {
				const {eventData, eventState}: IStoryRunnerYieldFormat = yield {type: "A"}
				yield {eventData, eventState, type: "B"}
			},
			getChildrenIterator: function*() {
			},
		}

		tester.dispatch({type: SET_EVENT_DATA, eventData: <StoryAnim.IEventData>{type: "TIME", frameTime: 1000}})
		const waitForA = tester.waitFor("A")
		const waitForB = tester.waitFor("B")
		tester.start(storyRunner, provider)
		tester.dispatch({type: SET_EVENT_DATA, eventData: <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 10}})
		tester.dispatch({type: SET_EVENT_DATA, eventData: <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 20}})

		const results = await Promise.all([waitForA, waitForB])
		results[1].should.deep.equal({type: "B", eventState: {pos: 20, frameTime: 1000}, eventData: {type: "SCROLL_POS", pos: 20}})
	})

	/** A provider that creates children.  The main loop creates two story items then exits, bringing down any children it has created. */
	const providerWithChildren = (neverExitChildren?: true) => <IStoryRunnerProvider>{
		id: "abc123",
		getStory: function*() {
			const nextEventData = yield {type: STORE_STORY_ITEM, payload: {id: "A"}}
			yield {type: STORE_STORY_ITEM, payload: {id: "B"}}
			yield deleteStoryItem({id: "B"})
		},
		getChildrenIterator: function*() {
			const {eventState: initialEventState}: IStoryRunnerChildrenStatus = yield []
			let eventState = initialEventState
			let runningCur = []
			while (true) {
				const myEventState = eventState
				const {eventState: eventStateNew, running}: IStoryRunnerChildrenStatus = yield [<IStoryRunnerProvider>{
					id: `abcChild_${eventState.pos}`,
					getStory: function*() {
						const nextEventData = yield {type: STORE_STORY_ITEM, payload: {id: myEventState.pos === 1 ? "A1" : (runningCur.length ? `A_${runningCur[0]}` : "VERY_WEIRD")}}
						while (neverExitChildren)
							yield {type: NOP}
					},
					getChildrenIterator: function*() {}
				}]
				eventState = eventStateNew
				runningCur = running
			}
		},
	}

	it("should run the story with children and dispatch any actions they produce", async () => {
		const {tester} = startMeUp()

		tester.start(storyRunner, providerWithChildren())
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 1}})
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 2}})

		await tester.waitFor(STORE_STORY_ITEM, true)
		const actions = tester.getCalledActions().filter(x => x.type === STORE_STORY_ITEM)
		actions.should.have.length(4)
		actions[0].should.have.property("payload").deep.equal({id: "A", owners: ["abc123"]})
		actions[1].should.have.property("payload").deep.equal({id: "B", owners: ["abc123"]})
		actions[2].should.have.property("payload").deep.equal({id: "A1", owners: ["abcChild_1"]})
		actions[3].should.have.property("payload").deep.equal({id: "A_abcChild_1", owners: ["abcChild_2"]})
	})

	it("should run the story and track the objects created by it and its children", async () => {
		const {tester} = startMeUp()

		tester.start(storyRunner, providerWithChildren(true))
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 1}})
		await tester.waitFor(STORE_STORY_ITEM, true)
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 2}})
		await tester.waitFor(STORE_STORY_ITEM, true)
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 50}})
		await tester.waitFor(STORE_STORY_ITEM, true)
		await delay(0) // Yield back to the sagas
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 80}})
		await delay(0) // Yield back to the sagas


		// await tester.waitFor(STORE_STORY_ITEM, true)
		const actions = tester.getCalledActions().filter(x => [STORE_STORY_ITEM, DELETE_STORY_ITEM].indexOf(x.type) > -1)
		actions.should.have.length(10)

		// B is deleted manually and should not be deleted again
		actions[4].should.have.property("type").equal(DELETE_STORY_ITEM)
		actions[4].should.have.property("payload").deep.equal({id: "B"})

		// Remove all the created items...
		actions[6].should.have.property("type").equal(DELETE_STORY_ITEM)
		actions[7].should.have.property("type").equal(DELETE_STORY_ITEM)
		actions[8].should.have.property("type").equal(DELETE_STORY_ITEM)
		actions[9].should.have.property("type").equal(DELETE_STORY_ITEM)
	})

	it("must provide smooth transitions", async () => {
		// This test verifies that exiting stories' items are deleted after entering stories' items are added,
		//  to allow transfer of ownership, without glitches.
		//  This allows the different stories to create the same item, and have it remain until none are using it.

		const {tester} = startMeUp()

		tester.start(storyRunner, providerWithChildren())
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 1}})
		await tester.waitFor(STORE_STORY_ITEM, true)
		const actions = tester.getCalledActions().filter(x => [STORE_STORY_ITEM, DELETE_STORY_ITEM].indexOf(x.type) > -1)
		actions.should.have.length(2)
		actions[0].should.have.property("type").equal(STORE_STORY_ITEM)
		actions[0].should.have.property("payload").property("id").equal("A")
		actions[1].should.have.property("type").equal(STORE_STORY_ITEM)
		actions[1].should.have.property("payload").property("id").equal("A1")

		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 2}})
		await tester.waitFor(STORE_STORY_ITEM, true)
		await delay(0) // Yield back to the sagas
		const actions2 = tester.getCalledActions().filter(x => [STORE_STORY_ITEM, DELETE_STORY_ITEM].indexOf(x.type) > -1)
		actions2.should.have.length(5)
		// The children are exiting immediately, hence we should see one delete and one create
		actions2[2].should.have.property("type").equal(STORE_STORY_ITEM)
		actions2[2].should.have.property("payload").deep.equal({id: "B", owners: ["abc123"]}) // Parent (irrelevant)
		actions2[3].should.have.property("type").equal(STORE_STORY_ITEM) // New child coming up
		actions2[3].should.have.property("payload").deep.equal({id: "A_abcChild_1", owners: ["abcChild_2"]})
		actions2[4].should.have.property("type").equal(DELETE_STORY_ITEM) // Remove of exiting child's visual
		actions2[4].should.have.property("payload").deep.equal({id: "A1", owners: ["abcChild_1"]})
	})
})
