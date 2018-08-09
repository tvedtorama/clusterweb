import * as React from 'react'

class FootingRaw extends React.Component {
	render() {
		return <div className="footing">
				<div className="background" />
				<div className="content">
					<h1 className="row">Thank you!</h1>
					<div className="row links">
						<span>To learn more about Phil, check out:</span>
						<a href="https://phil.network">Our main website</a>
						<a href="https://phil.network/en/prodblog">Our blog section</a>
						<a href="https://philapp.co">Or, try our alpha version</a>
					</div>
				</div>
			</div>
	}
}

export const Footing = FootingRaw
