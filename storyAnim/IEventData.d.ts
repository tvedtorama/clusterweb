namespace StoryAnim {
	export type IEventData = {
		type: "SCROLL_POS",
		pos: number,	
	} | {
		type: "TIME",
		elapsed: number,
	}	
}
