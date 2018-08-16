import { IWorldMapProps } from "../components/story/WorldMap";
import { storeStoryItem, IStoryRunnerYieldFormat, NOP } from "saga-stories";
import { slideStoryInnerDefault } from "saga-stories/storyAnim/storySupport/slideStory";

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
