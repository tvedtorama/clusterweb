import * as React from 'react'
import { Link, BrowserRouter as Router, Route, match } from 'react-router-dom';
import { CountTest } from './CountTest';
import { ScrollingContTest } from './ScrollingContTest';

require('../../sass/index.scss')

const HeiComp: React.StatelessComponent<{match: match<any>}> = ({match}) =>
	<span>We got hit {match.isExact ? "exactly" : "approximately"}</span>

// class HeiComp

const HalloComp = (props) => <span>You got hallo</span>

class WebMainRaw extends React.Component<{store: any}> {
	render() {
		return <div>
			<Router>
				<div>
					<div className={"paragraph"} style={{display: "flex", flexDirection: "column" }}>
						<span>This is the <Link to="/scrollTest">Scroll Test</Link></span>
					</div>
					<div className={"paragraph"} style={{display: "flex", flexDirection: "column" }}>
						<Route exact path="/" component={(p) => <span>Rootish!</span>} />
						<Route path="/hei" component={HeiComp} />
						<Route path="/hallo" component={HalloComp} />
						<Route path="/countTest" component={CountTest} />
						<Route path="/scrollTest" component={ScrollingContTest} />
					</div>
				</div>
			</Router>
		</div>
	}
}

export const WebMain = WebMainRaw