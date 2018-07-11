namespace StoryAnimDataSchema {
	export interface IItemBase {
		id: string
	}
	
	export interface IHierarchicalItem {
		parentId: string
	}
	
	export interface IStoryVisual {
		component: string
		props: any
	}
	
	export type IItemPosition = Partial<{
		x: number
		y: number
		z: number
	
		scale: number
		rotateX: number
	}>
	
	export interface IStoryItem extends IItemBase, IHierarchicalItem {
		visual: IStoryVisual
		position: IItemPosition
	}	
}

