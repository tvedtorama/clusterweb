import * as React from 'react'
import { Children } from './Children';
import { connect } from 'react-redux';

interface IProps {
	itemId: string
}

interface IMangledProps {
	itemVisual: StoryAnimDataSchema.IStoryVisual
}

class StoryItemRaw extends React.Component<IProps & IMangledProps> {
	render() {
		if (!this.props.itemVisual)
			return <div className="story-item-loading" />
		return <g>
			<text>{`Item  ${this.props.itemId} ${this.props.itemVisual.component}`}</text>
			<Children itemId={this.props.itemId} />
		</g>
	}
}

export const StoryItem = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemVisual: s.items.filter(x => x.id === p.itemId).map(x => x.visual)[0]
} as IMangledProps))(StoryItemRaw)
