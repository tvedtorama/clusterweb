import * as React from 'react'
import { Link, BrowserRouter as Router, Route, match } from 'react-router-dom';

const HeiComp: React.StatelessComponent<{match: match<any>}> = ({match}) =>
	<span>We got hit {match.isExact ? "exactly" : "approximately"}</span>

// class HeiComp

const HalloComp = (props) => <span>You got hallo</span>

class WebMainRaw extends React.Component<{store: any}> {
	render() {
		return <div>
			
			<Router>
				<div>
					<p style={{display: "flex", flexDirection: "column" }}>
						<span>This is the <Link to="/hei">Hei Link</Link></span>
						<span>This is the <Link to="/hei/paaDeg">HeiPaaDeg Link</Link></span>
					</p>
					<p style={{display: "flex", flexDirection: "column" }}>
						<span>The Route outputs:</span>
						<Route exact path="/" component={(p) => <span>Rootish!</span>} />
						<Route path="/hei" component={HeiComp} />
						<Route path="/hallo" component={HalloComp} />
					</p>
				</div>
			</Router>
		</div>
	}
}

export const WebMain = WebMainRaw