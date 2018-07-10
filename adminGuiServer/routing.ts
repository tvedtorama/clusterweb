import * as express from 'express'
import { generateCryptoRandomNumber } from '../utils/keys/cryptoKeys';
import { signJwt } from '../utils/security/jwt';
import { setupAdminGui } from '../utils/expressHandlers/loginGui';

export const router = express.Router()

const getLang = (req) => (req.headers['accept-language'] || '').indexOf('nb') === 0 ? 'no' : 'en'

const renderMain = (req: express.Request, res: express.Response, initialState = {}) =>
	res.render('home', {
		title: "Clusters",
		html: '<div class="loading-root" ></div>',
		initialState: JSON.stringify({
				lang: getLang(req),
				...initialState
			})
})

const chatUserIdPrefix = ""
const CHAT_USER_COOKIE = "admin-gui-user"
const CHAT_USER_SET_COOKIE = "getCTUser"

const askBrowserNotToCache = (res: express.Response) => {
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
	res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
	res.setHeader("Expires", "0"); // Proxies.
}

const setCookie = (newIdentity: string, res: express.Response) => {
	res.cookie(CHAT_USER_COOKIE, newIdentity, { httpOnly: true }) // Note: Should also be secure: true - hijacking this cookie will enable other users to see the chat
	res.cookie(CHAT_USER_SET_COOKIE, "yes")
}

const handleChatUserCookieSetup = async (req: express.Request, res: express.Response) => {
	const {clearIdentity: clearIdentityRaw} = req.query
	const clearIdentity = clearIdentityRaw === "true"
	const existingIdentity = req.cookies[CHAT_USER_COOKIE]
	if (!existingIdentity || clearIdentity)  {
		const randomNumber = await generateCryptoRandomNumber(Math.pow(2, 48))
		const newIdentity = chatUserIdPrefix + randomNumber.toString(16)
		setCookie(newIdentity, res)

		if (clearIdentity)
			askBrowserNotToCache(res)

		return newIdentity
	}
	return existingIdentity
}

router.use("/invite/:inviteId", async (req, res: express.Response) => {
	renderMain(req, res, {inviteId: req.params.inviteId})
})

router.use(/\/(someDefaultRoute|someOtherRoute)?$/, async (req, res: express.Response) => {
	const identity = await handleChatUserCookieSetup(req, res)
	const jwt = await signJwt("CTF", identity)
	renderMain(req, res, {jwt})
})

setupAdminGui(router)
