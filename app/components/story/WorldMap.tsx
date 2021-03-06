
import * as React from 'react'
import { spring, OpaqueConfig, StaggeredMotion } from 'react-motion';
import { feature } from "topojson-client"
import { GeometryCollection } from "topojson-specification";
import { geoPath } from 'd3-geo';
import { isUndefined, slowSpring } from 'saga-stories/utils';
import { GlowFilter } from 'saga-stories/components';
import { interestPoints } from '../../interestPoints';
import { IProjectionProps, ProjectionWrapper } from './worldMapProjections';

const worldDataJson = require('../../maps/110m.json')
const lakesDataJson = require('../../maps/110m_lakes.json').features

const worldData = feature(worldDataJson, worldDataJson.objects.countries as GeometryCollection).features

export interface IWorldMapProps {
	selectedHotspot?: number
	closeness?: "CLOSE" | "VERY_CLOSE" | "FAR"
}

const WorldMapContent: React.StatelessComponent<{projection, currentCity, worldData, scale}> = ({projection, currentCity, worldData, scale}) => [
	<g className="world-map countries" key="countries">
		{
			worldData.map((d, i) => (
				<path
					key={`path-${i}`}
					d={geoPath().projection(projection)(d)}
					className="country"
					fill={`rgb(76,100,100)`}
					stroke="#FFFFFF"
					strokeWidth={currentCity ? 0.4 : 0.5}
				/>
			))
		}
	</g>,
		<g className="world-map lakes" key="lakes">
		{
			lakesDataJson.map((d, i) => (
				<path
					key={`path-${i}`}
					d={geoPath().projection(projection)(d)}
					className="lake"
					fill={`rgb(220,220,255)`}
					opacity={0.5}
					strokeWidth={0}
				/>
			))
		}
	</g>,
	<g className="world-map markers" key="markers">
		{interestPoints.
			map(city => ({city, proj: projection(city.coordinates)})).
			map(({city, proj}) =>
			<g className="marker-root" key={proj[0].toString()} transform={`translate(${proj[0]}, ${proj[1]})`}>
				<circle
					r={3 * Math.pow(scale / 100, 0.5)}
					filter="url(#mapGlow)"
					className="marker" style={{animationDelay: Math.round(Math.random() * 1200).toString() + "ms"}}/>
				<g className="tooltip" transform={`translate(10, -15)`} style={{fontSize: 7}}>
					<rect className="background" width={80} height={80} />
					<rect className="heading-background" width={80} height={20} />
					<text x={40} y={10} fill={"white"}>{city.title}</text>
					{ /* <text x={40} y={30} fill={"white"}>Known for:</text> */ }
					<text x={40} y={50} fill={"white"}>{city.thing}</text>
				</g>
			</g>
			)}
	</g>
] as any

const animDefaults = {long: 0, lat: 0, scale: 100}
type IAnimProps = {[index in keyof typeof animDefaults]: OpaqueConfig}



/** Renders a map of the world.
 *
 * Inspired by: https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
  */
export class WorldMapRaw extends React.Component<IWorldMapProps & IProjectionProps, {worldData: typeof worldData}> {
	constructor(props) {
		super(props)
		this.state = {
			worldData,
		}
	}
	render() {
		const {createProjection} = this.props
		const currentCity = isUndefined(this.props.selectedHotspot) ? null : interestPoints[this.props.selectedHotspot].coordinates
		const animStyles: IAnimProps = currentCity ? {
			long: slowSpring(currentCity[0]),
			lat: slowSpring(currentCity[1]),
			scale: slowSpring(this.props.closeness === "VERY_CLOSE" ?
				3000 : this.props.closeness === "FAR" ? 600 : 1700),
		} :
			{
				long: spring(0), lat: spring(0), scale: spring(100)
			}
		// Uses Staggered to give the move a head start on the scale
		return [
			<GlowFilter key="filter" id="mapGlow" />,
			<StaggeredMotion key="gui" defaultStyles={[animDefaults, animDefaults]} styles={vals =>
				vals.map((_, i) => ({
					...animStyles,
					...(i > 0 ? {scale: slowSpring(vals[i - 1].scale)} : null)
				}))}>{
					(motions: [{long, lat}, {scale}]) =>
						[createProjection([motions[0].long, motions[0].lat], motions[1].scale)].
						map(projection => <WorldMapContent {...{currentCity, projection, worldData: this.state.worldData, scale: motions[1].scale}} />)
						[0]}
			</StaggeredMotion>
		]
	}
}

export const WorldMap = ProjectionWrapper(WorldMapRaw)
