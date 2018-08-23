namespace State {
	export interface IState extends StoryAnimState.IState {
		count: int

		storyMeta: {
			segmentPercentages?: number[]
		}
	}
}