import * as React from 'react'

export class PhilFeatures extends React.Component {
	render() {
		return [
			<h1 key="h" className="phil-features-header">Phil Network Features</h1>,
			<ul key="ul" className="phil-features">
				<li><i className="fa fa-comment"/><span>Web chat</span><span>Meet and track customers and relations on your own website.</span></li>
				<li><i className="fa fa-globe"/><span>Relation diagram</span><span>Browse the organization's relations network, with activities and relations' relations.</span></li>
				<li><i className="fa fa-paper-plane"/><span>Project management</span><span>Manage and communicate in cross organizational activites.  Manage people, roles and tasks.</span></li>
				<li><i className="fa fa-plug"/><span>Open API</span><span>Open API and excellent integration support</span></li>
			</ul>,
		]
	}
}

