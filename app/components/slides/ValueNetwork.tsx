import * as React from 'react'

export class ValueNetwork extends React.Component {
	render() {
		return [
			<h1 key="h">Clusters - Overview</h1>,
			<svg key="chart" viewBox="0 0 250 100" className={"value-network chart"}>

				<g transform={`translate(20, 35)`}>
					<path d={"M 0 0 C -5 10, 5 10, 0 30"} stroke={"black"} fill={"none"}/>
				</g>

				<g transform={`translate(20, 20)`} stroke={"orange"}>
					<circle cx={0} cy={0} r={15} fill={"white"} />
					<image xlinkHref={"/img/company.svg"} x={-7.5} y={-7.5} width={"15"} height={"15"} />
				</g>

				<g transform={`translate(20, 80)`} stroke={"blue"} opacity={0.5}>
					<circle cx={0} cy={0} r={15} fill={"white"} />
					<image xlinkHref={"/img/manufacture.svg"} x={-7.5} y={-7.5} width={"15"} height={"15"} />
				</g>


			</svg>,
			<div key="credits" className="value-network credits">
				<span className="credits-enabler">Credits</span>
				<div className="actual-credits">Icons made by <a href="https://www.flaticon.com/authors/geotatah" title="geotatah">geotatah</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
			</div>
		]
	}
}



