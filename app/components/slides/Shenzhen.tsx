import * as React from 'react'

export class ShenzhenIntro extends React.Component {
	render() {
		return [
			<h1 key="h">China, Shenzhen</h1>,
			<p key="p">After the communist takeover in China, the country's economic performance was less than impressive. The government decided to carefully test marked reforms, in limited areas they called <em>special economic zones</em>. Shenzhen was among the selected, the rules relaxed and creativity let loose in what would become the <code>Silicon Valley of hardware.</code></p>,
			<ul key="ul">
				<li>Strong international and domstic demand for electronics</li>
				<li>A skilled workforce with competitive salaries</li>
				<li>Dubious IP enforcment and copying lead to competition and innovation</li>
			</ul>
		]
	}
}

