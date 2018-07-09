import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {MediaContext} from './components/MediaContext'

import { Action } from "redux";
import { selectLanguage } from "./actions/langCust";
import { Store } from "redux";


export const runInitActions = (initialReactProps: any, store: Store<State.IState>, additionals: Action[] = []) =>
	[
		initialReactProps.lang && selectLanguage(initialReactProps.lang),
		...additionals
	].
		filter(x => x).
		forEach(action =>
			store.dispatch(action))



export const render = (store, Component: React.ComponentClass<{store: any}>) => {
	ReactDOM.render(
			<Provider store={store as any}>
				<MediaContext>
						<Component store={store}/>
				</MediaContext>
			</Provider>
		, document.getElementById('top'))
}
