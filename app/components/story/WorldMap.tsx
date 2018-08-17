
import * as React from 'react'
import {Subtract} from 'utility-types'
import { spring, OpaqueConfig, StaggeredMotion } from 'react-motion';
import { feature } from "topojson-client"
import { GeometryCollection } from "topojson-specification";
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { isUndefined } from 'saga-stories/utils';
import { slowSpring } from 'saga-stories/utils';
import { GlowFilter } from 'saga-stories/components';
import { cityCooridnates } from '../../interestPoints';

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
		{cityCooridnates.
			map(city => ({city, proj: projection(city)})).
			map(({city, proj}) =>
			<circle key={proj[0].toString()}
				cx={proj[0]}
				cy={proj[1]}
				r={3 * Math.pow(scale / 100, 0.5)}
				filter="url(#mapGlow)"
				className="marker"
		/>)}
	</g>
] as any

const animDefaults = {long: 0, lat: 0, scale: 100}
type IAnimProps = {[index in keyof typeof animDefaults]: OpaqueConfig}

export interface IProjectionProps {
	createProjection(center?: [number, number], scale?: number)
}

export const ProjectionWrapper = <P extends IProjectionProps>(Component: React.ComponentType<P>) =>
	class ProjectionWrapperClass extends React.Component<Subtract<P, IProjectionProps>> {
		createProjection(center?: [number, number], scale: number = 100) {
			const base = geoNaturalEarth1()
				.translate([0, 0])
			if (!center)
				return base
			return base.center(center).scale(scale) // translate([translate[0], translate[1]])
		}

		render() {
			return <Component {...this.props} createProjection={(a, b) => this.createProjection(a, b)} />
		}
	}


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
		const currentCity = isUndefined(this.props.selectedHotspot) ? null : cityCooridnates[this.props.selectedHotspot]
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
