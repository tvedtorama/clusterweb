import * as React from 'react'
import { Children } from './Children';
import { connect } from 'react-redux';
import { IItemFactory, ItemFactoryContext } from './factoryContext';
import { ROOT_STORY_COMPONENT } from '../storySupport/rootStory';
import { SLIDE_COMPONENT, Slide } from './Slide';
import { CONTAINER_COMPONENT, Container } from './Container';
import { PROGRESS_INDICATOR, ProgressIndicator } from './ProgressIndicator';

interface IProps {
	itemId: string
}

interface IMangledProps {
	itemVisual: StoryAnimDataSchema.IStoryVisual
}

const isHtmlComponent = (comp) => [SLIDE_COMPONENT, CONTAINER_COMPONENT].indexOf(comp) > -1 ? true :
	comp.indexOf("HTML_") === 0 ? true : false

const FactoryItem = (props: {component: string, factory: IItemFactory, props: any}) => {
	const Component = props.component === ROOT_STORY_COMPONENT ? (props => null) :
		props.component === SLIDE_COMPONENT ?
			Slide :
			props.component === PROGRESS_INDICATOR ?
				ProgressIndicator :
			props.component === CONTAINER_COMPONENT ?
				Container :
				props.factory.createComponent(props.component)
	return <Component {...{...props.props, factory: props.factory}} />
}

export const svgCoords = {x: -350, y: -150, width: 700, height: 300}

const DivWrapper = (classNameAdd: string) => props => <div className={`story-anim-div ${classNameAdd}`}>{props.children}</div>
const SvgWrapper = (classNameAdd: string) => props => <svg className={`story-anim-svg ${classNameAdd}`} viewBox={[svgCoords.x, svgCoords.y, svgCoords.width, svgCoords.height].join(' ')} style={{}}>{props.children}</svg>

class StoryItemRaw extends React.Component<IProps & IMangledProps> {
	render() {
		if (!this.props.itemVisual)
			return <div className="story-item-loading" />
		const ContainerVisual = (isHtmlComponent(this.props.itemVisual.component) ? DivWrapper : SvgWrapper)("")
		return <div className={`story-anim-item ${this.props.itemVisual.classNameAdd || ""}`} style={{}}>
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
