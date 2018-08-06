namespace StoryAnimDataSchema {
	export interface IItemBase {
		id: string
	}

	export interface IItemOwners {
		owners: string[]
	}
	
	export interface IHierarchicalItem {
		parentId: string
	}
	
	export interface IStoryVisual {
		component: string
		props: any
		classNameAdd?: string
	}
	
	export type IItemPosition = Partial<{
		x: number
		y: number
		z: number
	
		scale: number
		rotateX: number
	}>
	
	export interface IStoryItem extends IItemBase, Partial<IItemOwners>, Partial<IHierarchicalItem> {
		visual: IStoryVisual
		order?: number
		position: IItemPosition
		startPosition?: IItemPosition
	}
}

