namespace StoryAnimGUI {
	/** Used to control the value and animation of a style dimension internally in StoryAnim
	 * 
	 * Currently, only numberical values can be animated.
	 */
	export interface IStyleDimensionDef {
		defaultValue: number
		/** What prop to assign to, when multiple point to the same - they are concatenated (ex: `transform`) */
		propOutput: string
		/** Produce string to use in styles */
		serialize: (tx: number) => string
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => number,
	}

	/** Set of style dimensions   */
	export type IStyleDimensionDefs = {[fieldName: string]: IStyleDimensionDef}
}
