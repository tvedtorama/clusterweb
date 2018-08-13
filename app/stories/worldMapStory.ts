import { IWorldMapProps } from "../components/story/WorldMap";
import { storeStoryItem } from "../../storyAnim/actions/storyItem";
import { IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { NOP } from "../../storyAnim/actions/nop";
import { slideStoryInnerDefault } from "../../storyAnim/storySupport/slideStory";

const mapStoryInnerDefault = slideStoryInnerDefault

export const mapStoryImpl = (idAndParent: {id: string, parentId: string}, internal = mapStoryInnerDefault) =>
(existenceCheck: (s: StoryAnim.IEventState) => boolean, wmp?: IWorldMapProps, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*(initialState: StoryAnim.IEventState) {
	yield storeStoryItem({
		position,
		startPosition: position,
		...idAndParent,
		visual: {
			component: "MAP",
			props: wmp || {},
			classNameAdd: "world-map-root",
		}
	})
	while (true) {
		const state: IStoryRunnerYieldFormat = yield {type: NOP}
		if (!existenceCheck(state.eventState))
			return
	}
}
