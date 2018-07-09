import * as React from 'react'
import * as PropTypes from 'prop-types'

export enum MediaSize {
	MOBILE,
	SMALL,
	DESKTOP,
	HUGE
}

const eventsAreOk = window && window.addEventListener

// Note: React actually uses something like this as an example for the use of context:  https://facebook.github.io/react/docs/context.html

/**
 * Tracks media size and puts the results on the react context, available for subscribers down the react tree.
 */
export class MediaContext extends React.Component<any, {mediaSize: MediaSize}> {
	constructor(props) {
		super(props)

		this.setMediaSize(x => this.state = {mediaSize: x})
	}

	_eventHandler: () => void

	componentDidMount() {
		// INSANE: "this" is not the same in constructor and here, setting up the handlers in constructor leads to "setState un-mounted" errors!!!
		// This was the clever work of scheizze react-hot-loader, which efficiently replaced the this pointer with an augemented version after construction!

		this._eventHandler = () => this.setMediaSize()

		if (eventsAreOk) {
			window.addEventListener('resize', this._eventHandler)
		}
	}

	componentWillUnmount() {
		if (eventsAreOk) {
			window.removeEventListener('resize', this._eventHandler)
		}
	}

	static childContextTypes = {
		mediaSize: PropTypes.number
	}

	getChildContext() {
		return {mediaSize: this.state.mediaSize}
	}

	setMediaSize(updateFunc?: (MediaSize) => void) {
		const uf = updateFunc || (x => this.setState({mediaSize: x}))
		// For server rendering, the width should be passed from the client/browser
		const screenWidth = window && window.innerWidth ? window.innerWidth : 1000000
		const mediaSize = screenWidth <= 700 ? MediaSize.MOBILE :
			screenWidth <= 990 ? MediaSize.SMALL :
			screenWidth <= 1200 ? MediaSize.DESKTOP :
			MediaSize.HUGE
		uf(mediaSize)
	}

	render(): JSX.Element {
		return this.props.children as any
	}
}