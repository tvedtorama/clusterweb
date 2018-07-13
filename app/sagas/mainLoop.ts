import { spawn } from "redux-saga/effects";
import { storyRunner, IStoryRunnerProvider, IStoryRunnerChildrenStatus } from "../../storyAnim/storyRunner";
import { rootStory, childStoryGen } from "../stories/testStories";
import { filterChildren } from "../../storyAnim/storySupport/filterChildren";
import { getRootStory } from "../../storyAnim/storySupport/rootStory";

const parentId = "ROOT"

export const mainLoop = function*() {
	const storySetup: IStoryRunnerProvider = {
		id: parentId,
		getStory: rootStory,
		getChildrenIterator: function*() {
			let state: IStoryRunnerChildrenStatus = yield null
			while (true) {
				const newStories =
					filterChildren([
						state.eventState.pos > 40 && state.eventState.pos < 60 ? <IStoryRunnerProvider>{
							id: "Bacalao",
							getStory: childStoryGen(70, parentId),
							getChildrenIterator: function*() {}
						} : null
					], state.running)
				state = yield newStories
			}
		},
	}

	const realRootStory = getRootStory(storySetup)

	yield spawn(storyRunner, realRootStory, <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 0})
	// NOP
}