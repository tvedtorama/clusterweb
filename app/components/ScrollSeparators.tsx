import * as React from 'react'
import { connect } from 'react-redux';

type IMangledProps = State.IState["storyMeta"]

class ScrollSeparatorsRaw extends React.Component<IMangledProps> {
	render() {
		return <div className="scroll-separators">
				{this.props.segmentPercentages.map((sp, i) => <div className="scroll-separator" style={{height: `${sp}%`}} key={i} />)}
				<div className="scroll-separator last" />
			</div>
	}
}

export const ScrollSeparators = connect(({storyMeta: {segmentPercentages}}: State.IState) => ({segmentPercentages}))(ScrollSeparatorsRaw)
