import * as React from 'react'
import { Motion, spring, presets } from 'react-motion';

// This terrible, mutation-loving, library has a typings, but they don't really work
const Victor = require('victor')
const {fromArray} = Victor

interface IAnchor {id: string, point: [number, number]}

interface IOrg extends IAnchor {
	className: string
	icon: number
}

interface IConnector {
	from: string
	to: string
	swing?: number
	transfer?: {
		id: string
		icon: string
		direction: 1 | -1
	}
}

export interface IValueNetworkProps {
	orgs: IOrg[]
	connectors: IConnector[]
}

const orgRad = 15
const strokeWidth = 2
const orgRadActual = orgRad + strokeWidth
const coords = [0 - orgRadActual, 0 - orgRadActual, 400 + orgRadActual * 2, 100 + orgRadActual * 2]

const Connector = (props: {conn: IConnector, coords: [[number, number], [number, number]]}) =>
	<Motion defaultStyle={{swing: 150}} style={{swing: spring(180 + (props.conn.swing || 0), {damping: 4})}} >
	{({swing}) =>
	[{start: fromArray(props.coords[0]), end: fromArray(props.coords[1])}].
	map(({start, end}) =>
	({
			start,
			end,
			endLocal: end.clone().subtract(start),
	})).
	map(d => ({
		...d,
		normal: d.endLocal.clone().normalize(),
		endLocalHalf: d.endLocal.clone().multiply(new Victor(0.5, 0.5)),
	})).
	map(d => ({
			...d,
			normalRot: d.normal.clone().rotateDeg(90),
			normalOp: d.normal.clone().rotateDeg(180),
			backPointing: d.endLocal.clone().add(d.endLocalHalf.clone().rotateDeg(swing))
	})).
	map(({start, endLocal, normalRot, backPointing, endLocalHalf, normal}) =>
		<g transform={`translate(${start.x}, ${start.y})`}>
			<path d={`M 0 0 C ${endLocalHalf.x} ${endLocalHalf.y}, ${backPointing.x} ${backPointing.y}, ${endLocal.x} ${endLocal.y}`} stroke={"rgba(0, 0, 0, 0.5)"} fill={"none"}/>
		</g>
	)[0]
}</Motion>

const findConnCords = (conn: IConnector, anchors: IAnchor[]) =>
	[conn.from, conn.to].map(cId => anchors.find(({id}) => id === cId).point) as [[number, number], [number, number]]

export class ValueNetwork extends React.Component<IValueNetworkProps> {
	render() {
		return [
			<h1 key="h">Clusters - Value Flow</h1>,
			<svg key="chart" viewBox={coords.join(" ")} className={"value-network chart"}>
				{
					this.props.connectors.map(conn =>
						<Connector conn={conn} coords={findConnCords(conn, this.props.orgs)} />)
				}
				{
					this.props.orgs.map(org => <g key={org.id} transform={`translate(${org.point[0]}, ${org.point[1]})`} className={`vn-org ${org.className || org.id}`}>
						<circle r={orgRad} fill={"white"} />
						<text style={{font: "normal normal normal 14px/1 FontAwesome"}} dominantBaseline={"central"} textAnchor={"middle"} fill="none">{String.fromCharCode(org.icon)}</text>
					</g>)
				}
			</svg>,
		]
	}
}



