import * as React from 'react'
import {default as Typed, TypedOptions} from 'typed.js'

class HeadingRaw extends React.Component {
	typed: Typed
	subtitle: HTMLSpanElement
	componentDidMount() {
		const options: TypedOptions = {
			strings: [
				"The Industrial Cluster Accelerator",
				"See why clusters are amazing!",
				"Scroll down to learn about clusters in the digital world.",
			],
			typeSpeed: 50,
			backSpeed: 90,
			loop: true,
			startDelay: 1000 as any,
		}
		this.typed = new Typed(this.subtitle as any, options)
	}
	render() {
		return <div className="heading">
				<div className="background" />
				<div className="content">
					<div className="logo-row row">
						<div className="logo" />
						<span className="produc-name">Phil Network</span>
					</div>
					<div className="subtitle-row row">
						<span className="subtitle" ref={r => this.subtitle = r}/>
					</div>
				</div>
				<div className="scroll-text">
					<i className="fa fa-hand-o-down" />
					<span>Scroll down to learn more about industrial clusters!</span>
				</div>
			</div>
	}
}

export const Heading = HeadingRaw
