/// <reference path="../ISagaTester.d.ts" />

import * as chai from 'chai'
import SagaTester from 'redux-saga-tester'
import { IStoryRunnerProvider, storyRunner, IStoryRunnerChildrenStatus, IStoryRunnerYieldFormat } from '../../storyAnim/storyRunner';
import { SET_EVENT_DATA } from '../../storyAnim/actions/eventData';
import { combineReducers } from 'redux';
import { storyAppReducers } from '../../storyAnim/reducers';


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

	it("should run the story with children and dispatch any actions they produce", async () => {
		const {tester} = startMeUp()

		const provider = <IStoryRunnerProvider>{
			id: "abc123",
			getStory: function*() {
				const nextEventData = yield {type: "A"}
				yield {...nextEventData, type: "B"}
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
							const nextEventData = yield {type: myEventState.pos === 1 ? "A1" : (runningCur.length ? `A_${runningCur[0]}` : "VERY_WEIRD")}
							// yield {...nextEventData, type: "BX"}
						},
						getChildrenIterator: function*() {}
					}]
					eventState = eventStateNew
					runningCur = running
				}
			},
		}

		const waitForA = tester.waitFor("A")
		const waitForA1 = tester.waitFor("A1")
		const waitForA2 = tester.waitFor("A_abcChild_1") // This time abcChild_1 should be running, hence it is added to the name
		const waitForB = tester.waitFor("B")
		tester.start(storyRunner, provider)
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 1}})
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 2}})

		const results = await Promise.all([waitForA, waitForB, waitForA1, waitForA2])
// 		results[1].should.deep.equal({type: "B", balubaTime: true})
	})

	it("should run the story and track the objects created by it and its children", async () => {
		// and cancel stuffs
	})

})
