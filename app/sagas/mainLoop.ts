import { spawn } from "redux-saga/effects";
import { storyRunner, getRootStory } from "saga-stories";
import { clusterStorySetup } from "../stories/clusterStories";


export const mainLoop = function*() {

	const storySetup = clusterStorySetup

	const realRootStory = getRootStory(storySetup)

	yield spawn(storyRunner, realRootStory, <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 0})
	// NOP
}