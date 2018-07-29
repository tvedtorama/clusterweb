import * as React from 'react'

export const CONTAINER_COMPONENT = "CONTAINER"

/** Empty container for use on parent items that does not have a visual. */
export class Container extends React.Component {
	render() {
		return null
	}
}