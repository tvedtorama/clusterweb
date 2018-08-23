import { spawn, put } from "redux-saga/effects";
import { storyRunner, getRootStory } from "saga-stories";
import { clusterStorySetup, segmentMetas } from "../stories/clusterStories";

export const SET_STORY_META = "SET_STORY_META"

type IAggTup = [number[], number]

export const mainLoop = function*() {

	const storySetup = clusterStorySetup

	const realRootStory = getRootStory(storySetup)

	yield put({type: SET_STORY_META, payload: {segmentPercentages:
		[...segmentMetas.
			map(x => x.startPos).
			sort((a, b) => a > b ? 1 : -1),
			100].
		reduce<IAggTup>((x, y) => y !== x[1] ? [[...x[0], y - x[1]], y] : x, [[], 0])[0]
	}})

	yield spawn(storyRunner, realRootStory, <StoryAnim.IEventData>{type: "SCROLL_POS", pos: 0})
}