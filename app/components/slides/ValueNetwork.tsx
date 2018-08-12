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

interface IConnectorTransfer {
	id: string
	icon: number
	direction: 1 | -1
	started: number
}

interface IConnector {
	from: string
	to: string
	swing?: number
	transfer?: IConnectorTransfer
}

export interface IValueNetworkProps {
	orgs: IOrg[]
	connectors: IConnector[]
}

const connectorClass = "connector"
const idPrefix = "id-"

const orgRad = 15
const strokeWidth = 2
const orgRadActual = orgRad + strokeWidth
const coords = [0 - orgRadActual, 0 - orgRadActual, 400 + orgRadActual * 2, 100 + orgRadActual * 2]

const ConnectorTransfer = ({point, transfer, opacity}: {point: SVGPoint, transfer: IConnectorTransfer, opacity: number}) =>
	<g transform={`translate(${point.x}, ${point.y})`} style={{opacity}}>
		<circle r={7} fill="white" stroke="black" />
		<text style={{font: "normal normal normal 8px/1 FontAwesome"}}
			dominantBaseline={"central"} textAnchor={"middle"} fill="black">
				{String.fromCharCode(transfer.icon)}
			</text>
	</g>

const Connector = (props: {id: string, conn: IConnector, refSvg?: SVGPathElement, coords: [[number, number], [number, number]]}) =>
	<Motion defaultStyle={{swing: 150}} style={{swing: spring(180 + (props.conn.swing || 0), {damping: 2, stiffness: 10})}} >
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
			normalOp: d.normal.clone().rotateDeg(180),
			backPointing: d.endLocal.clone().add(d.endLocalHalf.clone().rotateDeg(swing))
	})).
	map(({start, endLocal, backPointing, endLocalHalf}) =>
		<g transform={`translate(${start.x}, ${start.y})`}>
			<path className={`${connectorClass} ${idPrefix}${props.id}`} d={`M 0 0 C ${endLocalHalf.x} ${endLocalHalf.y}, ${backPointing.x} ${backPointing.y}, ${endLocal.x} ${endLocal.y}`} stroke={"rgba(0, 0, 0, 0.5)"} fill={"none"}/>
			{
				props.conn.transfer && props.refSvg &&
						<Motion defaultStyle={{p: 0}} style={{p: spring(100, {damping: 10, stiffness: 6})}} key={props.conn.transfer.id}>
						{({p}) =>
							[props.conn.transfer.direction > 0 ? p : 100 - p].
							map(p =>
								props.refSvg.getPointAtLength(p * props.refSvg.getTotalLength() / 100)).
							map(point =>
								<ConnectorTransfer {...{point, transfer: props.conn.transfer, opacity: Math.min(1, 1.25 - Math.abs(p - 50) / 40)}} />
							)[0]
						}</Motion>
			}
		</g>
	)[0]
}</Motion>

const findConnCords = (conn: IConnector, anchors: IAnchor[]) =>
	[conn.from, conn.to].map(cId => anchors.find(({id}) => id === cId).point) as [[number, number], [number, number]]

export class ValueNetwork extends React.Component<IValueNetworkProps> {
	svg: SVGSVGElement;

	getRefMap() {
		if (!this.svg)
			return {}

		const connectors = this.svg.getElementsByClassName(connectorClass)
		let refMap = {}
		for (const x of connectors)
			for (const c of x.classList)
				if (c.startsWith(idPrefix))
					refMap[c.substr(3)] = x
		return refMap
	}

	render() {
		const refMap = this.getRefMap()
		return [
			<h1 key="h">Clusters - Value Flow</h1>,
			<svg key="chart" ref={r => this.svg = r} viewBox={coords.join(" ")} className={"value-network chart"}>
				{
					this.props.connectors.
						map(conn => ({conn, id: conn.from + conn.to})).
						map(x => ({...x, refSvg: refMap[x.id]})).
						sort((x, y) => x.id > y.id ? 1 : -1).
						map(({conn, id, refSvg}) =>
							<Connector {...{conn, id, refSvg}} coords={findConnCords(conn, this.props.orgs)} key={id} />)
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



