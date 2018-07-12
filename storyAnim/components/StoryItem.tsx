import * as React from 'react'
import { Children } from './Children';
import { connect } from 'react-redux';
import { IItemFactory, ItemFactoryContext } from './factoryContext';

interface IProps {
	itemId: string
}

interface IMangledProps {
	itemVisual: StoryAnimDataSchema.IStoryVisual
}

const FactoryItem = (props: {component: string, factory: IItemFactory, props: any}) => {
	const Component = props.factory.createComponent(props.component)
	return <Component {...props.props} />
}

class StoryItemRaw extends React.Component<IProps & IMangledProps> {
	render() {
		if (!this.props.itemVisual)
			return <div className="story-item-loading" />
		return <div className="story-anim-item" style={{width: "100%", height: "100%"}}>
			<svg viewBox={`-500 -500 1000 1000`} style={{width: "100%", height: "100%"}}>
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
