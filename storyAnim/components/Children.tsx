/// <reference path="../IState.d.ts" />

import * as React from 'react'
import { connect } from 'react-redux';
import { StoryItem } from './StoryItem';
import { Motion } from 'react-motion';
import { createBuildStyles } from '../utils/components/buildStyles';
import { isUndefined } from 'util';
import { slowSpring } from '../utils/springs';

interface IProps {
	itemId: string
}

interface IChildData {
	itemId: string
	itemPosition: StoryAnimDataSchema.IItemPosition
}

interface IMangledProps {
	itemChildren: IChildData[]
}

const dimensionDefs: StoryAnimGUI.IStyleDimensionDefs = {
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
	scale: {
		defaultValue: 1,
		propOutput: "transform",
		serialize: scale => `scale(${scale})`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.scale,
	},
	rotateX: {
		defaultValue: 0,
		propOutput: "transform",
		serialize: ang => `rotateX(${ang}deg)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => {
			return itemPos.rotateX
		}
	}

}
const dimensionKeys = Object.keys(dimensionDefs)

const buildStyles = createBuildStyles(dimensionDefs)

const buildAnimationStyles = (item: IChildData) =>
	dimensionKeys.map(key => ({key, value: dimensionDefs[key].srcData(item.itemPosition)})).
	map(({key, value}) => ({key, value: isUndefined(value) ? dimensionDefs[key].defaultValue : value})).
	reduce((x, {key, value}) => ({...x, [key]: slowSpring(value)}), {})

class ChildrenRaw extends React.Component<IProps & IMangledProps> {
	render() {
		return this.props.itemChildren.map(item =>
			<Motion key={item.itemId}
				defaultStyle={dimensionKeys.reduce((x, key) => ({...x, [key]: dimensionDefs[key].defaultValue}), {})}
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

export const Children = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemChildren: s.items.filter(x => x.parentId === p.itemId).map(x => ({itemId: x.id, itemPosition: x.position}))
} as IMangledProps))(ChildrenRaw)