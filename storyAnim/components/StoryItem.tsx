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
			<path
				d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" 
				transform={`scale(10) translate(-40 -40) `}
				fillOpacity={0.5}
			/>
			<text>{`Item  ${this.props.itemId} ${this.props.itemVisual.component}`}</text>
			<Children itemId={this.props.itemId} />
		</g>
	}
}

export const StoryItem = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemVisual: s.items.filter(x => x.id === p.itemId).map(x => x.visual)[0]
} as IMangledProps))(StoryItemRaw)
