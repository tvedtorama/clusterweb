/// <reference path="../IState.d.ts" />

import * as React from 'react'
import { connect } from 'react-redux';
import { StoryItem } from './StoryItem';

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


class ChildrenRaw extends React.Component<IProps & IMangledProps> {
	render() {
		return this.props.itemChildren.map(x =>
			<div key={x.itemId} className="story-anim-child" style={{transform: `translateX(${x.itemPosition.x}px) translateY(${x.itemPosition.y}px)`}}>
				<StoryItem itemId={x.itemId} />
			</div>)
	}
}

export const Children = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemChildren: s.items.filter(x => x.parentId === p.itemId).map(x => ({itemId: x.id, itemPosition: x.position}))
} as IMangledProps))(ChildrenRaw)