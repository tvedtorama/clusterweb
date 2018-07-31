import * as React from 'react'
import { IItemFactory } from './factoryContext';

export const SLIDE_COMPONENT = "SLIDE"

export type ISlideProps = {text: string} | {slide: string, factory: IItemFactory}

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
					[this.props.factory.createComponent(this.props.slide)].map(Comp => <Comp />)[0]
			}
		</div>
	}
}