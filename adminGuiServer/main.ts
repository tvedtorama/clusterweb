import {router} from './routing'
import { expressSetup } from '../utils/appFramework/expressSetup';

let start = (app) => {
	expressSetup(app, router)
}

export default start
