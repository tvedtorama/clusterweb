import * as React from 'react'
import { Children } from './Children';
import { connect } from 'react-redux';
import { IItemFactory, ItemFactoryContext } from './factoryContext';
import { ROOT_STORY_COMPONENT } from '../storySupport/rootStory';

interface IProps {
	itemId: string
}

interface IMangledProps {
	itemVisual: StoryAnimDataSchema.IStoryVisual
}

const FactoryItem = (props: {component: string, factory: IItemFactory, props: any}) => {
	const Component = props.component === ROOT_STORY_COMPONENT ? (props => null) : props.factory.createComponent(props.component)
	return <Component {...props.props} />
}

class StoryItemRaw extends React.Component<IProps & IMangledProps> {
	render() {
		if (!this.props.itemVisual)
			return <div className="story-item-loading" />
		return <div className="story-anim-item" style={{}}>
			<svg className="story-anim-svg" viewBox={`-400 -225 800 450`} style={{}}>
				<ItemFactoryContext.Consumer>
					{factory => <FactoryItem {...this.props.itemVisual} {...{factory}} />}
				</ItemFactoryContext.Consumer>
			</svg>
			<Children itemId={this.props.itemId} />
		</div>
	}
}

export const StoryItem = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemVisual: s.items.filter(x => x.id === p.itemId).map(x => x.visual)[0]
} as IMangledProps))(StoryItemRaw)
