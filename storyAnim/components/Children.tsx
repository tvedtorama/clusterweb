/// <reference path="../IState.d.ts" />

import * as React from 'react'
import { connect } from 'react-redux';
import { StoryItem } from './StoryItem';
import { Motion } from 'react-motion';
import { createBuildStyles } from '../utils/components/buildStyles';
import { slowSpring } from '../utils/springs';
import { isUndefined } from '../utils/lowLevelUtils';

interface IProps {
	itemId: string
}

interface IChildData {
	itemId: string
	itemStartPosition?: StoryAnimDataSchema.IItemPosition
	itemPosition: StoryAnimDataSchema.IItemPosition
}

interface IMangledProps {
	itemChildren: IChildData[]
}

const dimensionDefs: StoryAnimGUI.IStyleDimensionDefs = {
	rotateX: {
		defaultValue: 0,
		propOutput: "transform",
		serialize: ang => `rotateX(${ang}deg)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => {
			return itemPos.rotateX
		}
	},
	scale: {
		defaultValue: 1,
		propOutput: "transform",
		serialize: scale => `scale(${scale})`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.scale,
	},
	translateX: {
		defaultValue: 0,
		propOutput: "transform",
		serialize: tx => `translateX(${tx}%)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.x,
	},
	translateY: {
		defaultValue: 0,
		propOutput: "transform",
		serialize: ty => `translateY(${ty}%)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.y,
	},
}
const dimensionKeys = Object.keys(dimensionDefs)

const buildStyles = createBuildStyles(dimensionDefs)

const findValuesWidthDefault = (itemPosition: StoryAnimDataSchema.IItemPosition) =>
	dimensionKeys.map(key => ({key, value: dimensionDefs[key].srcData(itemPosition)})).
	map(({key, value}) => ({key, value: isUndefined(value) ? dimensionDefs[key].defaultValue : value}))

const buildAnimationStyles = (item: IChildData) =>
	findValuesWidthDefault(item.itemPosition).
	reduce((x, {key, value}) => ({...x, [key]: slowSpring(value)}), {})

const buildDefaultStyles = (item: IChildData) =>
	findValuesWidthDefault(item.itemStartPosition || {}).
	reduce((x, {key, value}) => ({...x, [key]: value}), {})

class ChildrenRaw extends React.Component<IProps & IMangledProps> {
	render() {
		return this.props.itemChildren.map(item =>
			<Motion key={item.itemId}
				defaultStyle={buildDefaultStyles(item)}
				style={buildAnimationStyles(item)}>
				{
					animState => {
						// console.log(`Motion render, ${item.itemId}`, animState)
						return <div className="story-anim-child" style={buildStyles(animState)}>
							<StoryItem itemId={item.itemId} />
						</div>
					}
				}</Motion>)
	}
}

const order = (x: StoryAnimDataSchema.IStoryItem) => isUndefined(x.order) ? 100 : x.order

export const Children = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemChildren: s.items.filter(x => x.parentId === p.itemId).
		sort((a, b) => order(a) - order(b)).
		map(x => ({
			itemId: x.id,
			itemPosition: x.position,
			itemStartPosition: x.startPosition,
		} as IChildData))
} as IMangledProps))(ChildrenRaw)