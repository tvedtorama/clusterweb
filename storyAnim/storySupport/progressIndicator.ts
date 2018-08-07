import { storeStoryItem } from "../actions/storyItem";
import { PROGRESS_INDICATOR, IProgressIndicatorProps } from "../components/ProgressIndicator";
import { NOP } from "../actions/nop";
import { ROOT_STORY_ID } from "./rootStory";

/** Story element that creates a story indicator and keps roolling for the duration of the story */
export const progressIndicator = (interestPoints: number[], position: StoryAnimDataSchema.IItemPosition = {scale: 0.5}) =>
	function*() {
		yield storeStoryItem({
			position,
			startPosition: position,
			id: "PROGRESS_INDICATOR",
			parentId: ROOT_STORY_ID,
			order: 1000,
			visual: {
				classNameAdd: "progress-indicator-root",
				component: PROGRESS_INDICATOR,
				props: <IProgressIndicatorProps>{interestPoints},
			}
		})
		while (true) {
			yield {type: NOP}
		}
	}
