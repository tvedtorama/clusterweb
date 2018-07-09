import {createStore as reduxCreateStore, applyMiddleware, Store, compose, Action} from 'redux'
import {default as reducer} from './reducers'
import {default as createSagaMiddleware} from 'redux-saga'
import {createEpicMiddleware} from 'redux-observable'
import {actionCreators} from './utils/devToolsActionCreators'

import {mainLoop} from './sagas/mainLoop'

export function createStore(loginFlow: boolean): Store<State.IState> {
	const windowMod = window as any
	const epicMiddleware = createEpicMiddleware()
	const sagaMiddleware = createSagaMiddleware()
	const store = reduxCreateStore<State.IState, Action, any, any>(reducer,
			compose(applyMiddleware(epicMiddleware, sagaMiddleware), windowMod.devToolsExtension ? windowMod.devToolsExtension({actionCreators}) : f => f) as any)

	sagaMiddleware.run(mainLoop, loginFlow, {})

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers').default
			store.replaceReducer(nextReducer)
		})
	}

	return store
}
