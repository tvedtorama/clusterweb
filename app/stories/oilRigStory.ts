import { IImageKey } from "../components/images";
import { IStoryRunnerYieldFormat, storeStoryItem, NOP } from "saga-stories";

// TODO: Refactor this with boatStory
export const oilRigStory = (existenceCheck: (s: StoryAnim.IEventState) => boolean, rootPosition: StoryAnimDataSchema.IItemPosition = {}, startPosition?: StoryAnimDataSchema.IItemPosition) =>
	function*(initialState: StoryAnim.IEventState) {
		const rotateAngle = Math.random() * 2  - 1;
		const delay = 500 + Math.random() * 5500
		const rotatePosition = ({x, y}) => ({x: x * Math.cos(rotateAngle) - y * Math.sin(rotateAngle), y: y * Math.cos(rotateAngle) + x * Math.sin(rotateAngle)})
		const startTime = initialState.frameTime
		const boatComp: IImageKey = "HTML_OIL_RIG"
		const waitLoop = function*(startTime: number = -1, exitTime = -1) {
			while (true) {
				const state: IStoryRunnerYieldFormat = yield {type: NOP}
				if (!existenceCheck(state.eventState))
					return false
				if (startTime > 0 && state.eventState.frameTime - startTime > delay) {
					const position = {...rootPosition, ...rotatePosition({x: rootPosition.x || 0, y: rootPosition.y || 0})}
					return existenceCheck((<IStoryRunnerYieldFormat>(yield storeStoryItem({
						position,
						startPosition: position,
						id: `THE_OIL_RIG_${rotateAngle}`,
						parentId: "THE_MAP",
						visual: {
							component: boatComp,
							props: {}
						}
					}))).eventState)
				}
				if (exitTime > 0 && state.eventState.frameTime - exitTime > delay)
					return false
			}
		}

		// First wait for item to be added, then wait for timeout
		if (yield* waitLoop(startTime))
			yield* waitLoop(undefined, startTime + delay + 2000)
	}
