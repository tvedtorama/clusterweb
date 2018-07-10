/// <reference path="../IState.d.ts" />

import * as React from 'react'
import { connect } from 'react-redux';

interface IProps {
	itemId: string
}

class ChildrenRaw extends React.Component<IProps> {
	render() {
		return <div><span>{`Children  ${this.props.itemId}`}</span></div>
	}
}

export const Children = connect((s: StoryAnimState.IState) => ({}))(ChildrenRaw)