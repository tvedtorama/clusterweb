/// <reference path="../ISagaTester.d.ts" />

import * as chai from 'chai'
import SagaTester from 'redux-saga-tester'
import {default as reducer} from '../../app/reducers';
import { IStoryRunnerProvider, storyRunner, IStoryRunnerChildrenStatus } from '../../storyAnim/storyRunner';
import { SET_EVENT_DATA } from '../../storyAnim/actions/eventData';
import * as Ix from 'ix'


chai.should()

describe("storyRunner", () => {
	const startMeUp = () => {
		const initialState = {}
		const createSagaTester = (logger = (...args) => {}) => new SagaTester({initialState, reducers: reducer, options: {logger}})
		const tester = createSagaTester()
		return {tester}
	}

	it("should run the story and dispatch any actions it produces", async () => {
		const {tester} = startMeUp()

		let cnt = 0
		const cnter = () => cnt++
		const result = Ix.Iterable.range(0, 10).reduce(() => cnter(), 0)
		result.should.equal(9)

		const provider = <IStoryRunnerProvider>{
			id: "abc123",
			getStory: function*() {
				const nextEventData = yield {type: "A"}
				yield {...nextEventData, type: "B"}
			},
			getChildrenIterator: function*() {
			},
		}

		const waitForA = tester.waitFor("A")
		const waitForB = tester.waitFor("B")
		const task = tester.start(storyRunner, provider)
		tester.dispatch({type: SET_EVENT_DATA, eventData: {}})
		tester.dispatch({type: SET_EVENT_DATA, eventData: {balubaTime: true}})

		const results = await Promise.all([waitForA, waitForB])
		results[1].should.deep.equal({type: "B", balubaTime: true})
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
				const {eventData: eventDataInput}: IStoryRunnerChildrenStatus = yield []
				let eventData = eventDataInput
				while (true) {
					if (eventData.type === "SCROLL_POS") {
						const myEventData = eventData
						const {eventData: eventDataNew}: IStoryRunnerChildrenStatus = yield [<IStoryRunnerProvider>{
							id: `abcChild_${eventData.pos}`,
							getStory: function*() {
								const nextEventData = yield {type: myEventData.pos === 1 ? "A1" : "A2"}
								// yield {...nextEventData, type: "BX"}
							},
							getChildrenIterator: function*() {}
						}]
						eventData = eventDataNew
					} else {
						throw new Error("You are far from the place you should be")
					}
				}
			},
		}

		const waitForA = tester.waitFor("A")
		const waitForA1 = tester.waitFor("A1")
		const waitForA2 = tester.waitFor("A2")
		const waitForB = tester.waitFor("B")
		const task = tester.start(storyRunner, provider)
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 1}})
		tester.dispatch({type: SET_EVENT_DATA, eventData: {type: "SCROLL_POS", pos: 2}})

		const results = await Promise.all([waitForA, waitForB, waitForA1, waitForA2])
// 		results[1].should.deep.equal({type: "B", balubaTime: true})
	})

	it("should run the story and track the objects created by it and its children", async () => {
	})

})
