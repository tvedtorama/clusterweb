import {WebMain} from './components/WebMain';
import {createStore} from './createStore'
// import {setupBufferedLogs} from '../utils/logger/buffered'
// import { setToken } from './sagas/init';
import { runInitActions, render } from './commonInit';

// setupBufferedLogs()

const initialReactProps = (window as any).initialReactProps

const store = createStore(false);

runInitActions(initialReactProps, store, [])

render(store, WebMain)

if (module.hot) {
	module.hot.accept('./components/WebMain', () => {
		const NextApp = require("./components/WebMain").WebMain;
		render(store, NextApp)
	})
	module.hot.accept('./createStore.ts', () => {
		// This stupidness is needed to allow tsx modules to reload when first referenced by stories
		console.warn('Store and stories reload not implemented')
	})

	// module.hot.accept() This could also work, but not as well...
}
