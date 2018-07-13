import { IStoryRunnerProvider } from "../storyRunner";

/** Assuming a list of child stories, remove the ones that are either `null` or already running */
export const filterChildren = (newStories: (IStoryRunnerProvider)[], running: string[]) =>
	newStories.
		filter(x => x ? true : false).
		filter(x => !running.find(z => z === x.id))
