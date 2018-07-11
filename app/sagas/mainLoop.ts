import { spawn } from "redux-saga/effects";
import { storyRunner, IStoryRunnerProvider } from "../../storyAnim/storyRunner";
import { rootStory } from "../stories/testStories";

export const mainLoop = function*() {
	const storySetup: IStoryRunnerProvider = {
		id: "ROOT",
		getStory: rootStory,
		getChildrenIterator: function*() {},
	}

	yield  spawn(storyRunner, storySetup, <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 0})
	// NOP
}