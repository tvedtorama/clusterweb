/// <reference path="../IState.d.ts" />

import * as React from 'react'
import { connect } from 'react-redux';
import { StoryItem } from './StoryItem';
import { Motion, spring } from 'react-motion';
import { createBuildStyles } from '../utils/components/buildStyles';

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
		serialize: tx => `translateX(${tx}px)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.x,
	},
	translateY: {
		defaultValue: 0,
		propOutput: "transform",
		serialize: ty => `translateY(${ty}px)`,
		srcData: (itemPos: StoryAnimDataSchema.IItemPosition) => itemPos.y,
	}
}
const dimensionKeys = Object.keys(dimensionDefs)

const buildStyles = createBuildStyles(dimensionDefs)

class ChildrenRaw extends React.Component<IProps & IMangledProps> {
	render() {
		return this.props.itemChildren.map(item =>
			<Motion key={item.itemId}
				defaultStyle={dimensionKeys.reduce((x, key) => ({...x, [key]: dimensionDefs[key].defaultValue}), {})}
				style={dimensionKeys.reduce((x, key) => ({...x, [key]: spring(dimensionDefs[key].srcData(item.itemPosition))}), {})}
				>
				{animState =>
			<div className="story-anim-child" style={buildStyles(animState)}>
				<StoryItem itemId={item.itemId} />
				</div>}</Motion>)
	}
}

export const Children = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemChildren: s.items.filter(x => x.parentId === p.itemId).map(x => ({itemId: x.id, itemPosition: x.position}))
} as IMangledProps))(ChildrenRaw)