import { slideStoryImpl } from "../../storyAnim/storySupport/slideStory";
import { IValueNetworkProps } from "../components/slides/ValueNetwork";
import { IStoryRunnerYieldFormat } from "../../storyAnim/storyRunner";

// Note: Icon codes deduced from FA 4.7 website.  Sure there must be an import available somewhere.
const industry = 0xf275
const cogs = 0xf085
const flask = 0xf0c3
const gavel = 0xf0e3
const coctail = 0xf000
const gift = 0xf06b
const user = 0xf007
const dollarSign = 0xf155
const gem = 0xf219

const valueIcons = [coctail, gem, gift, user]

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
	let state = generateState()
	while (true) {
		const storyState: IStoryRunnerYieldFormat = yield state
		const rand = Math.random()
		if (rand < 0.5) {
			const inactive = state.connectors.
					map((c, i) => ({c, i})).
					filter(x => !x.c.transfer || x.c.transfer.started < storyState.eventState.frameTime - 2000)
			if (inactive.length === 0)
				continue
			const activate = inactive[Math.round(Math.random() * 100) % inactive.length].i
			const isPayment = rand < 0.20
			state = <IValueNetworkProps>{
				...state,
				connectors:
					[
						...state.connectors.filter((x, i) => i !== activate),
						{
							...state.connectors[activate],
							transfer: {
								direction: isPayment ? -1 : 1,
								icon: isPayment ? dollarSign : valueIcons[Math.round(rand * 100) % valueIcons.length],
								id: rand.toString(),
								started: storyState.eventState.frameTime,
							}
						}
					]
			}
		}
	}
}

export const valueNetworkStoryImpl = (idAndParent: {id: string, parentId: string}) =>
	(existenceCheck, pos) => slideStoryImpl(idAndParent, valueNetworkPropsProvider)
				(existenceCheck, {s: "SLIDE_VALUE_NETWORK"}, pos)