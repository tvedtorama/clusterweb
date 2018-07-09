import * as express from 'express'
// import { setupStreamingLogs } from '../logger/streaming';
import {join} from 'path'
import * as bodyParser from 'body-parser'

export const expressSetup = (app: express.Express, router: express.Router, setupLogs = true) => {
	const appRoot = join(__dirname, "../../../")
	console.log("CurDir and appRoot: ", __dirname, appRoot)
	app.use("/static", express.static(appRoot + "dist"));
	app.use("/static", express.static(appRoot + "public/dist"));
	app.use("/img", express.static(appRoot + "public/img"));
	app.use("/doc", express.static(appRoot + "public/doc"));
	app.use("/bootstrap", express.static(appRoot + "node_modules/bootstrap"))

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	app.use('/', router)

/*	if (setupLogs)
		setupStreamingLogs() */

	console.log('start')
}