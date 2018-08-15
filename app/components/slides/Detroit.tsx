import * as React from 'react'

export class DetroitIntro extends React.Component {
	render() {
		return [
			<h1 key="h1">Detroit - Motor City</h1>,
			<p key="p">By the 20ies, people had realized the value and freedom offered by automobiles, and the market was booming. Although initially challenged by contenders from around the country, all the major motor companies settled in the Detroit area.</p>,
			<ul key="ul">
				<li>Ford Motors, with support from existing transport companies, started the show</li>
				<li>Detroit had the tooling and sub-contractors needed by the industry</li>
				<li>Major investments was initiated by leaders who knew the industry inside out</li>
			</ul>
		]
	}
}
