import * as React from 'react'
import { Motion, spring, presets } from 'react-motion';
import { GlowFilter } from 'saga-stories/storyAnim/components/ProgressIndicator';
import { ProjectionWrapper, IProjectionProps } from '../story/WorldMap';
import { Maybe } from 'saga-stories/storyAnim/utils/monad';

// This terrible, mutation-loving, library has a typings, but they don't really work
const Victor = require('victor')
const {fromArray} = Victor

type IPoint = [number, number]

interface IAnchor {id: string, point: IPoint}

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
	classNameAdd?: string
	text: string
}

interface IProject {
	id: string
	members: string[]
}

export interface IValueNetworkProps {
	orgs: IOrg[]
	connectors: IConnector[]
	projects: IProject[]
}

export const getConnId = (conn: IConnector) => conn.from + conn.to

const connectorClass = "connector"
const idPrefix = "id-"

const orgRad = 8
const strokeWidth = 0.5
const orgRadActual = orgRad + strokeWidth
const svgCoords = [0 - orgRadActual, -5 - orgRadActual, 200 + orgRadActual * 2, 65 + orgRadActual * 2]
const transferRad = 4.5

/** Project border, as a path with curves between two points, and caption text.
 *
 * Sets up spline points to corner the organizations at the start and end.
*/
const ProjectBorder = ({points, center, text}: {points: [IPoint, IPoint], center: IPoint, text: string}) =>
	Maybe.some({
			start: fromArray(points[1]),
			end: fromArray(points[0]),
			center: fromArray(center),
			orgRadScale: new Victor(orgRad * 1.6, orgRad * 1.6),
		})
		.map(({start, end, center, orgRadScale}) => ({
			start, end, center, orgRadScale,
			startVect: start.clone().subtract(center).normalize().multiply(orgRadScale),
			endVect: end.clone().subtract(center).normalize().multiply(orgRadScale),
			id: points.map(x => x.join('')).join('')
		})).map(prev => ({
			...prev,
			start: prev.start.add(prev.startVect),
			end: prev.end.add(prev.endVect),
			cpointScale: new Victor(1.3, 1.3)
		})).map(prev => ({
			...prev,
			startDirPoint: prev.startVect.clone().rotateDeg(90).multiply(prev.cpointScale).add(prev.start),
			endDirPoint: prev.endVect.clone().rotateDeg(-90).multiply(prev.cpointScale).add(prev.end),
		})).map(({start: s, end: e, startDirPoint: sdp, endDirPoint: edp, id}) =>
			<g className="project-border">
				<path d={`M ${s.x} ${s.y} C ${sdp.x} ${sdp.y} ${edp.x} ${edp.y} ${e.x} ${e.y}`} id={id} />
				<text className={"project-border-text"} x={20} y={10}>
					<textPath xlinkHref={`#${id}`}>
						{text}
					</textPath>
				</text>
			</g>
		)
		.getOrElse(null)

/** Encircling of orgs */
const Project = ({id, project, coords}: {id: string, project: IProject, coords: IPoint[]}) =>
	Maybe.some(coords.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]))
		.map(z => z.map(x => x / coords.length))
		.map((center: IPoint) => coords
			.map((c, i) => [c, coords[(i + 1) % coords.length]] as [IPoint, IPoint])
			.map((cPair, i) =>
				<ProjectBorder key={i} points={cPair} center={center} text="Project" />
			))
		.map(arr =>
			<g className="project-related">{arr}</g>
		)
		.getOrElse(null)


/** The transfer of value along the parent path */
const ConnectorTransfer = ({point, transfer, opacity}: {point: SVGPoint, transfer: IConnectorTransfer, opacity: number}) =>
	<g transform={`translate(${point.x}, ${point.y})`} style={{opacity}} className="connector">
		<circle r={transferRad} fill="white" filter={"url(#connectorGlow)"}/>
		<text style={{font: "normal normal normal 5px/1 FontAwesome"}} x={0.05} y={0.2}
			dominantBaseline={"central"} textAnchor={"middle"} fill="black">
				{String.fromCharCode(transfer.icon)}
			</text>
	</g>

/** Draws a path between two org(-anisation)s.  Uses the previous render as a path reference for value transfers. */
const Connector = (props: {id: string, conn: IConnector, refSvg?: SVGPathElement, coords: [IPoint, IPoint]}) =>
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
			backPointing: d.endLocal.clone().add(d.endLocalHalf.clone().rotateDeg(swing)),
			id: `${idPrefix}${props.id}`,
	})).
	map(({start, endLocal, backPointing, endLocalHalf, id}) =>
		<g transform={`translate(${start.x}, ${start.y})`} className={`${props.conn.classNameAdd || ""}`} >
			<path className={`${connectorClass} ${id}`}
				d={`M 0 0 C ${endLocalHalf.x} ${endLocalHalf.y}, ${backPointing.x} ${backPointing.y}, ${endLocal.x} ${endLocal.y}`}
				stroke={"rgba(0, 0, 0, 0.5)"} fill={"none"} id={`${id}`}/>
			<text x={12} className="connector-text">
				<textPath xlinkHref={`#${id}`}>{props.conn.text || ""}</textPath>
			</text>
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

const findProjectCords = (conn: {members: string[]}, anchors: IAnchor[]) =>
	conn.members.map(cId => anchors.find(({id}) => id === cId).point) as [IPoint, IPoint]

const findConnCords = (conn: IConnector, anchors: IAnchor[]) =>
	findProjectCords({members: [conn.from, conn.to]}, anchors)

export class ValueNetworkGraphics extends React.Component<IValueNetworkProps> {
	rootElm: SVGGElement;

	getRefMap() {
		if (!this.rootElm)
			return {}

		const connectors = this.rootElm.getElementsByClassName(connectorClass)
		let refMap = {}
		for (const x of connectors)
			for (const c of x.classList)
				if (c.startsWith(idPrefix))
					refMap[c.substr(3)] = x
		return refMap
	}

	render() {
		const refMap = this.getRefMap()
		return <g ref={r => this.rootElm = r} strokeWidth={strokeWidth}>
				<GlowFilter key="filter" id="connectorGlow" />
				{
					this.props.connectors.
						map(conn => ({conn, id: getConnId(conn)})).
						map(x => ({...x, refSvg: refMap[x.id]})).
						sort((x, y) => x.id > y.id ? 1 : -1).
						map(({conn, id, refSvg}) =>
							<Connector {...{conn, id, refSvg}} coords={findConnCords(conn, this.props.orgs)} key={id} />)
				}
				{
					this.props.orgs.map(org => <g key={org.id} transform={`translate(${org.point[0]}, ${org.point[1]})`} className={`vn-org ${org.className || org.id}`}>
						<circle r={orgRad} fill={"white"} />
						<text style={{font: "normal normal normal 8px/1 FontAwesome"}} dominantBaseline={"central"} textAnchor={"middle"} fill="none">{String.fromCharCode(org.icon)}</text>
					</g>)
				}
				{
					this.props.projects.map(p =>
						<Project id="n/a" key={p.members.join(' ')} project={p} coords={findProjectCords(p, this.props.orgs)} />
					)
				}
			</g>
	}
}

export const MappedValueNetworkGraphics = ProjectionWrapper((props: IValueNetworkProps & IProjectionProps) =>
	[props.createProjection([0, 0])].map(projection =>
		<ValueNetworkGraphics {...{...{...props, orgs: props.orgs.map(o => ({...o, point: projection(o.point)}))}}} />
	)[0])

export const ValueNetwork = (props: IValueNetworkProps) =>
		[
			<h1 key="h">Value Flow in Clusters</h1>,
			<svg key="chart" viewBox={svgCoords.join(" ")} className={"value-network chart"}>
				<ValueNetworkGraphics {...props} />
			</svg>,
		]



