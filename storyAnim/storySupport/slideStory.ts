import { ISlideProps } from "../components/Slide";
import { NOP } from "../actions/nop";
import { IStoryRunnerYieldFormat } from "../storyRunner";
import { storeStoryItem } from "../actions/storyItem";
import { ISlideKey } from "../../app/components/slides";

export const slideStoryInnerDefault = function*() {
	yield {}
	while (true)
		yield null
}

/** Slide story, lives on till told to exit.
 *
 * Returns a method that can be called to generate the actual story.
 */
export const slideStoryImpl = (idAndParent: {id: string, parentId: string}, internal = slideStoryInnerDefault) =>
	(existenceCheck: (s: StoryAnim.IEventState) => boolean, slideText: string | {s: ISlideKey}, position: StoryAnimDataSchema.IItemPosition = {}) =>
	function*() {
		const internalGen = internal()
		const internalGenProps = internalGen.next().value
		const getStoryItemToStore = (internalGenProps) => storeStoryItem({
			position,
			startPosition: position,
			...idAndParent,
			order: 200,
			visual: {
				component: "SLIDE",
				classNameAdd: "taller-on-mobile",
				props: (typeof slideText === "string" ? <ISlideProps>{text: slideText} : <ISlideProps>{slide: slideText.s, props: internalGenProps}),
			}
		})
		let state: IStoryRunnerYieldFormat = yield getStoryItemToStore(internalGenProps)
		while (true) {
			const internalGenProps = internalGen.next(state).value
			state = yield internalGenProps ? getStoryItemToStore(internalGenProps) : {type: NOP}
			if (!existenceCheck(state.eventState))
				return
		}
	}
