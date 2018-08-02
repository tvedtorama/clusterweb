import * as React from 'react'
import { svgCoords } from './StoryItem';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	let angleInRadians;
	angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians)
	};
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
	let arcSweep, end, start;
	start = polarToCartesian(x, y, radius, endAngle);
	end = polarToCartesian(x, y, radius, startAngle);
	arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
	return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
};

export const PROGRESS_INDICATOR = "PROGRESS_INDICATOR"

const circRad = 100
const borderExtra = 1.25
const interestWidth = 15

const getScaleTranslate = (scale) =>
	[{x: -svgCoords.x - circRad * scale * borderExtra, y: svgCoords.y + circRad * scale * borderExtra}].
	map(({x, y}) => `translate(${x} ${y}) scale(${scale})`)
	[0]

export interface IProgressIndicatorProps {
	interestPoints: number[]
}

interface IMangledProps {
	pos: number
}

/** Shows how far the user is in the full story, with interest points along the way.
 *
 * Inspired by: https://codepen.io/icebob/pen/JYoQZg */
export class ProgressIndicatorRaw extends React.Component<IProgressIndicatorProps & IMangledProps, {hot?: boolean}> {
	hotTimer = null
	constructor(props) {
		super(props)
		this.state = {}
	}

	setNewTimer(t) {
		if (this.hotTimer) {
			clearTimeout(this.hotTimer)
		}
		this.hotTimer = t
	}

	componentWillReceiveProps(props: IMangledProps) {
		if (props.pos !== this.props.pos) {
			this.setState({hot: true})
			this.setNewTimer(setTimeout(() => this.setState({hot: false}), 2000))
		}
	}

	componentWillUnmount() {
		this.setNewTimer(null)
	}


	render() {
		const scale = this.state.hot ? 0.4 : 0.2;
		const {interestPoints} = this.props
		return [
			<defs key="defs">
					<pattern id="dotPattern"
									x="0" y="0" width="10" height="10"
									patternUnits="userSpaceOnUse">
							<circle className="bgDot" cx="5" cy="5" r="2" />
					</pattern>
					<radialGradient id="backHoleBelowClock" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
						<stop offset="60%" style={{stopColor: "rgb(0,0,0)", stopOpacity: 0.8}}/>
						<stop offset="100%" style={{stopColor: "rgb(0,0,0)", stopOpacity: 0.0}}/>
					</radialGradient>

					<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
							<feMerge>
									<feMergeNode in="coloredBlur"/>
									<feMergeNode in="SourceGraphic"/>
							</feMerge>
					</filter>
					<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="shadow"/>
						<feOffset dx="1" dy="1"/>
						<feMerge>
							<feMergeNode/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>,
			<Motion key="g" defaultStyle={{end: 0, scale: 0.5}} style={{end: spring(this.props.pos * 3.6), scale: spring(scale)}}>
				{({scale, end}) => // can put this on g: style={{opacity: scale}}
					<g className={`process-indicator ${this.state.hot ? "hot" : ""}`} transform={getScaleTranslate(scale)} >
						<circle cx="0" cy="0" r={circRad * borderExtra} fill="url(#backHoleBelowClock)"/>
						<g className="process-background">
							<text className="caption" dominantBaseline={"central"} textAnchor={"middle"}>{`${interestPoints.filter(p => p <= this.props.pos).length} / ${interestPoints.length}`}</text>
						</g>

						<g className="process-circle-and-interest-points">
							<circle className="clockCircle" cx="0" cy="0" r={circRad} strokeWidth="6" />
							{
								interestPoints.map((p, i) =>
									[polarToCartesian(0, 0, circRad, p * 3.6)].
										map(({x, y}) => ({o: {x, y}, r: {x: x - interestWidth / 2, y: y - interestWidth / 2.25, width: interestWidth, height: interestWidth / 1.12}})).
										map(cr =>
										<g key={i}>
											<rect className="clockCircle interest" {...cr.r} rx={interestWidth / 10} ry={interestWidth / 12} />
											<text className="caption interest" {...cr.o} dominantBaseline={"central"} textAnchor={"middle"}>i</text>
										</g>
									)[0]
								)
							}
						</g>
						<path className="clockArc hour" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" d={describeArc(0, 0, circRad, 0, end)} />
						<circle className="clockDot hour" r="8" filter="url(#glow)" cx={polarToCartesian(0, 0, circRad, end).x} cy={polarToCartesian(0, 0, circRad, end).y} />
					</g>
				}
			</Motion>
		]
	}
}

export const ProgressIndicator = connect((state: StoryAnimState.IState) => ({
	pos: state.eventState.pos,
} as IMangledProps))(ProgressIndicatorRaw)
