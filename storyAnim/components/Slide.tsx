import * as React from 'react'

export const SLIDE_COMPONENT = "SLIDE"

/** Hosts a html slide.
 *
 * ATW, StoryItem has hardcoded support for showing slides as plain HTML, not svg.
 */
export class Slide extends React.Component<{text: string}> {
	render() {
		return <div className="slide">
			<span>{this.props.text}</span>
			{this.props.children}
		</div>
	}
}