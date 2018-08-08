import * as React from 'react'

class HeadingRaw extends React.Component {
	render() {
		return <div className="heading">
				<div className="background" />
				<div className="content">
					<div className="logo-row row">
						<div className="logo" />
						<span className="produc-name">Phil Network</span>
					</div>
					<div className="subtitle-row row">
						<span className="subtitle">The Industrial Cluster Accelerator</span>
					</div>
				</div>
				<div className="scroll-text">
					<span>Scroll down to learn more about industrial clusters!</span>
				</div>
			</div>
	}
}

export const Heading = HeadingRaw
