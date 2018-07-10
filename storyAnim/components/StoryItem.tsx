import * as React from 'react'
import { Children } from './Children';

interface IProps {
	itemId: string
}

class StoryItemRaw extends React.Component<IProps> {
	render() {
		return <div>
			<span>{`Item  ${this.props.itemId}`}</span>
			<Children itemId={this.props.itemId} />
		</div>
	}
}

export const StoryItem = StoryItemRaw