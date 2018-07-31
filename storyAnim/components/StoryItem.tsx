import * as React from 'react'
import { Children } from './Children';
import { connect } from 'react-redux';
import { IItemFactory, ItemFactoryContext } from './factoryContext';
import { ROOT_STORY_COMPONENT } from '../storySupport/rootStory';
import { SLIDE_COMPONENT, Slide } from './Slide';
import { CONTAINER_COMPONENT, Container } from './Container';

interface IProps {
	itemId: string
}

interface IMangledProps {
	itemVisual: StoryAnimDataSchema.IStoryVisual
}

const isHtmlComponent = (comp) => [SLIDE_COMPONENT, CONTAINER_COMPONENT].indexOf(comp) > -1 ? true : false

const FactoryItem = (props: {component: string, factory: IItemFactory, props: any}) => {
	const Component = props.component === ROOT_STORY_COMPONENT ? (props => null) :
		props.component === SLIDE_COMPONENT ?
			Slide :
			props.component === CONTAINER_COMPONENT ?
				Container :
				props.factory.createComponent(props.component)
	return <Component {...props.props} />
}

const DivWrapper = props => <div className="story-anim-div">{props.children}</div>
const SvgWrapper = props => <svg className="story-anim-svg" viewBox={`-200 -150 400 300`} style={{}}>{props.children}</svg>

class StoryItemRaw extends React.Component<IProps & IMangledProps> {
	render() {
		if (!this.props.itemVisual)
			return <div className="story-item-loading" />
		const ContainerVisual = isHtmlComponent(this.props.itemVisual.component) ? DivWrapper : SvgWrapper
		return <div className="story-anim-item" style={{}}>
			<ContainerVisual>
				<ItemFactoryContext.Consumer>
					{factory => <FactoryItem {...this.props.itemVisual} {...{factory}} />}
				</ItemFactoryContext.Consumer>
			</ContainerVisual>
			<Children itemId={this.props.itemId} />
		</div>
	}
}

export const StoryItem = connect((s: StoryAnimState.IState, p: IProps) => ({
	itemVisual: s.items.filter(x => x.id === p.itemId).map(x => x.visual)[0]
} as IMangledProps))(StoryItemRaw)
