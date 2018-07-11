namespace ReduxActions {
	/** Redux action content where a new item, or the item to apply, is stored as the `payload`. */
	interface IPayloadAction<T extends StoryAnimDataSchema.IItemBase> {
		payload: T
	}
}
