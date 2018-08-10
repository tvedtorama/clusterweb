import { slideStoryImpl } from "../../storyAnim/storySupport/slideStory";
import { IValueNetworkProps } from "../components/slides/ValueNetwork";

const industry = 0xf275
const cogs = 0xf085
const flask = 0xf0c3
const gavel = 0xf0e3

const generateState = () => <IValueNetworkProps>{
	orgs: [
		{
			id: "C1",
			icon: industry,
			point: [90, 0],
		},
		{
			id: "C2",
			icon: industry,
			point: [310, 0],
		},
		{
			id: "S1",
			icon: flask,
			point: [30, 95],
		},
		{
			id: "S2",
			icon: cogs,
			point: [90, 100],
		},
		{
			id: "S3",
			icon: cogs,
			point: [200, 100],
		},
		{
			id: "S4",
			icon: gavel,
			point: [350, 95],
		},
	],
	connectors: [{
		from: "S1",
		to: "C1",
	}, {
		from: "S2",
		to: "C1",
	}, {
		from: "S4",
		to: "C1",
	}, {
		from: "S3",
		to: "C2",
		swing: -10,
	}, {
		from: "S2",
		to: "C2",
		swing: 10,
	}, {
		from: "S4",
		to: "C2",
	}
	]
}

const valueNetworkPropsProvider = function*() {
	while (true) {
		yield generateState()
	}
}

export const valueNetworkStoryImpl = (idAndParent: {id: string, parentId: string}) =>
	(existenceCheck, pos) => slideStoryImpl(idAndParent, valueNetworkPropsProvider)
				(existenceCheck, {s: "SLIDE_VALUE_NETWORK"}, pos)