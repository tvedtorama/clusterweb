import * as React from 'react'
import { connect } from 'react-redux';
import { Observable, merge, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from 'redux';
import { ofType } from 'redux-observable';

export const INCREMENT = "INCREASE"
const INCREMENT_MANUAL = "INCREASE_MANUAL"

export const countEpic = (action$: Observable<Action>) => 
	merge(action$.pipe(
			ofType(INCREMENT_MANUAL),
		),
		timer(2000, 2000)).pipe(
			map(x => ({type: INCREMENT})) // Could have used mapTo
		)

interface IProps {
}
interface IMangledProps {
	count: number
	increment: () => void
}

class CountTestRaw extends React.Component<IProps & IMangledProps> {
	render() {
		return <div>
			<span>{this.props.count}</span>
			<a onClick={() => this.props.increment()} className="button"><span>Increment</span></a>
		</div>
	}
}

export const CountTest = connect((s: State.IState) => s, {
	increment: () => ({type: INCREMENT_MANUAL})
})(CountTestRaw)