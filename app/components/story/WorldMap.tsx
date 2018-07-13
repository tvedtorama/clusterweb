
import * as React from 'react'
import { feature } from "topojson-client"
import { GeometryCollection } from "topojson-specification";
import { geoNaturalEarth1, geoPath } from 'd3-geo';

const worldDataJson = require('../../maps/50m.json')

const worldData = feature(worldDataJson, worldDataJson.objects.countries as GeometryCollection).features

/** Renders a map of the world.
 *
 * Inspired by: https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
  */
export class WorldMap extends React.Component<any, {worldData: typeof worldData}> {
	constructor(props) {
		super(props)
		this.state = {
			worldData,
		}
	}
	projection() {
		return geoNaturalEarth1()
			.scale(100)
			.translate([0, 0])
	}
	render() {
		const cityCooridnate: [number, number] = [-83.045754, 42.331427] // Detroit
		return [
				<g className="countries" key="countries">
					{
						this.state.worldData.map((d, i) => (
							<path
								key={`path-${i}`}
								d={geoPath().projection(this.projection())(d)}
								className="country"
								fill={`rgba(38,50,56,${1 / this.state.worldData.length * i})`}
								stroke="#FFFFFF"
								strokeWidth={0.5}
							/>
						))
					}
				</g>,
				<g className="markers" key="markers">
					<circle
						cx={this.projection()(cityCooridnate)[0]}
						cy={this.projection()(cityCooridnate)[1]}
						r={8}
						fill="#E91E63"
						className="marker"
					/>
				</g>
		]
	}
}


