import * as React from 'react'

export class EnterPhil extends React.Component {
	render() {
		return [
			<h1 key="h">Enter: The Phil Network</h1>,
			<p key="p">The Phil Network is a cloud based cluster management system.  It helps build and track your organization's nexus of value, with suppliers and customers</p>,
			<ul key="ul">
				<li>Track organizations and resources in long and short term relations</li>
				<li>Leverage digital trust throgh identity certificates and ratings</li>
				<li>Find the right team for the job in our massive catalog of global teams <em>(*)</em></li>
				<li><div className="aligned-row"><span>Use built-in communication tools, or connect with</span><img src={"/img/commCompLogos.png"}></img></div></li>
			</ul>,
			<span key="asterix" className="tone-down"><em>*</em> - coming soon</span>,
		]
	}
}

