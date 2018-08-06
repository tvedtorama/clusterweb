import { IImageKey } from "../components/images";
import { IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";
import { storeStoryItem } from "../../storyAnim/actions/storyItem";
import { NOP } from "../../storyAnim/actions/nop";

export const boatStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, position: StoryAnimDataSchema.IItemPosition = {}, startPosition?: StoryAnimDataSchema.IItemPosition) =>
	function*(initialState: StoryAnim.IEventState) {
		const rotateAngle = Math.random() * 2  - 1;
		const delay = 500 + Math.random() * 5500
		const rotatePosition = ({x, y}) => ({x: x * Math.cos(rotateAngle) - y * Math.sin(rotateAngle), y: y * Math.cos(rotateAngle) + x * Math.sin(rotateAngle)})
		const startTime = initialState.frameTime
		const boatComp: IImageKey = "HTML_BOAT"
		const waitLoop = function*(startTime: number = -1, exitTime = -1) {
			while (true) {
				const state: IStoryRunnerYieldFormat = yield {type: NOP}
				if (!existenceCheck(state.eventState))
					return false
				if (startTime > 0 && state.eventState.frameTime - startTime > delay)
					return existenceCheck((<IStoryRunnerYieldFormat>(yield storeStoryItem({
						position: {...position, ...rotatePosition({x: position.x || 0, y: position.y || 0})},
						startPosition,
						id: `THE_BOAT_${rotateAngle}`,
						parentId: "THE_MAP",
						visual: {
							component: boatComp,
							props: {}
						}
					}))).eventState)
				if (exitTime > 0 && state.eventState.frameTime - exitTime > delay)
					return false
			}
		}

		// First wait for item to be added, then wait for timeout
		if (yield* waitLoop(startTime))
			yield* waitLoop(undefined, startTime + delay + 2000)
	}
