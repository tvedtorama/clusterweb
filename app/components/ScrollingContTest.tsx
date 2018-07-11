import * as React from 'react'
import { StoryItem } from '../../storyAnim/components/StoryItem';

class ScrollingContTestRaw extends React.Component {
	render() {
		return <div className="scroll-test">
			<div className="scrolling-container">
				<div className="sliding-container">
					<div className="sliding-content">
						<span>Hello</span>
						<svg viewBox={`-500 -500 1000 1000`}>
							<StoryItem itemId={"ROOT"} />
						</svg>
					</div>
				</div>
			</div>
			<div className="non-scrolling-footer">
				<span>Non-scrolling</span>
			</div>
		</div>
	}
}

export const ScrollingContTest = ScrollingContTestRaw