import * as React from 'react'

class ScrollingContTestRaw extends React.Component {
	render() {
		return <div className="scroll-test">
			<div className="scrolling-container">
				<div className="sliding-container">
					<div className="sliding-content"><span>Hello</span></div>
				</div>
			</div>
			<div className="non-scrolling-footer">
				<span>Non-scrolling</span>
			</div>
		</div>
	}
}

export const ScrollingContTest = ScrollingContTestRaw