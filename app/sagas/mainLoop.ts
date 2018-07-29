import { spawn } from "redux-saga/effects";
import { storyRunner, IStoryRunnerProvider, IStoryRunnerChildrenStatus } from "../../storyAnim/storyRunner";
import { rootStory, childStoryGen } from "../stories/testStories";
import { filterChildren } from "../../storyAnim/storySupport/filterChildren";
import { getRootStory } from "../../storyAnim/storySupport/rootStory";
import { clusterStorySetup } from "../stories/clusterStories";



export const mainLoop = function*() {

	const storySetup = clusterStorySetup

	const realRootStory = getRootStory(storySetup)

	yield spawn(storyRunner, realRootStory, <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 0})
	// NOP
}