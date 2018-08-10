import { slideStoryImpl } from "../../storyAnim/storySupport/slideStory";
import { IValueNetworkProps } from "../components/slides/ValueNetwork";


const valueNetworkPropsProvider = function*() {
	let cnt = -1
	yield <IValueNetworkProps>{cnt}
	while (true) {
		cnt += 1
		yield <IValueNetworkProps>{cnt}
	}
}

export const valueNetworkStoryImpl = (idAndParent: {id: string, parentId: string}) =>
	(existenceCheck, pos) => slideStoryImpl(idAndParent, valueNetworkPropsProvider)
				(existenceCheck, {s: "SLIDE_VALUE_NETWORK"}, pos)