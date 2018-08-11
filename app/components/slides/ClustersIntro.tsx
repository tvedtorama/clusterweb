import * as React from 'react'

export class ClustersIntro extends React.Component {
	render() {
		// Issues:
		// All companies are part of a cluster, not all are part of super-clusters
		// All value networks are vital in the value creation - not all provide exceptional performance.
		return [
			<h1 key="h">Industrial Clusters</h1>,
			<p key="p">Clusters are groups of organizations from different industries, that together deliver exceptional performance.  They typically consist of some big companies in front with competing sub-contractors.  Dig deeper and you'll find a flow of people and skills crossing the company borders.<br/><br/><code>Traditionally</code> they have relied on geographical proximity, personal networks and hard earned trust.</p>,
		]
	}
}

