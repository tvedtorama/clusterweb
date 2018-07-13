import { IStoryRunnerProvider } from "../storyRunner";
import { STORE_STORY_ITEM, storeStoryItem } from "../actions/storyItem";
import { NOP } from "../actions/nop";
import { filterChildren } from "./filterChildren";

export const ROOT_STORY_ID = "ROOT"
export const ROOT_STORY_COMPONENT = ROOT_STORY_ID

/** Root story to use on top of story tree, never exits.  Renders using `ROOT` visual component which is handled by the GUI. */
export const getRootStory = (storySetup: IStoryRunnerProvider): IStoryRunnerProvider => ({
	id: ROOT_STORY_ID,
	getStory: function*() {
		yield storeStoryItem({
				position: {}, // ATW: Position not used for real root
				id: ROOT_STORY_ID,
				visual: {
					component: ROOT_STORY_COMPONENT,
					props: {}
				}
			})
		// Root must not exit, it will stop the animation
		while (true) {
			yield {type: NOP}
		}
	},
	getChildrenIterator: function*() {
		let state = yield null
		while (true) {
			state = yield filterChildren([storySetup], state.running)
		}
	}
})