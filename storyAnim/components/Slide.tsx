import * as React from 'react'
import { IItemFactory } from './factoryContext';

export const SLIDE_COMPONENT = "SLIDE"

export type ISlideProps = {text: string} | {slide: string, factory: IItemFactory, props?: any}

/** Hosts a html slide.
 *
 * ATW, StoryItem has hardcoded support for showing slides as plain HTML, not svg.
 */
export class Slide extends React.Component<ISlideProps> {
	render() {
		return <div className="slide">
			{
				"text" in this.props ?
					<span>{this.props.text}</span> :
					[this.props].
						map(({factory, slide, props}) => ({Comp: factory.createComponent(slide), props})).
						map(({Comp, props}) => <Comp {...{...props}} />)[0]
			}
			<div className="footer-line" />
		</div>
	}
}