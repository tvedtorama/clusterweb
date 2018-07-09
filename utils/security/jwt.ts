import * as _ from 'lodash'
import * as express from 'express'
import * as jwtCheckLib from 'express-jwt'
import * as jwt from 'jsonwebtoken'
import * as fs from 'mz/fs';
import * as path from 'path'

const secretKey = Buffer.from('7yDGYyHl+uLcFkgEBmdDcf9Hz5juB0mPq4E+iUrui3', 'utf8')
const audience = 'cluster-web'

const findItInHeaders = (req: express.Request) =>
	[req.headers["authorization"]]. // Note: Headers seems to be reset to lower case
	filter((x: string) => x != null && x.startsWith("Bearer ")).
	map((x: string) => x.substr("Bearer".length).trim())
	[0]

/** Express middleware that checks the request for a valid jwt token.
 *
 * Note: The `secret` part can be converted to a function - which takes the jwt payload.  Here we can load different keys based on the `issuer` or `audience`.
 */
export const jwtCheck = jwtCheckLib({
	getToken: (req: express.Request) => {
		return req.body.token || req.query.token || req.cookies.token || findItInHeaders(req)
	},
	secret: secretKey,
	audience,
})

const timestampify = (unix) => Math.round(unix / 1000)

interface IKeyDataAlg {
	algorithm
}

interface IKeyData extends Partial<IKeyDataAlg> {
	key
}

const getKeyAndOptions = _.memoize(async (): Promise<IKeyData> => {
	try {
		const key = await fs.readFile(path.join(__dirname, "../../../keys/jwtPrivate.key"))
		return {
			key,
			algorithm: "RS256",
		}
	} catch {
	}
	return {
		key: secretKey,
	}
})

const algOption: (keyof IKeyData)[] = ["algorithm"]

export const signJwt = async (userName: string, id: string, expired = false) => {
	const keyData = await getKeyAndOptions()
	return <string><any>jwt.sign({
		sub: id,
		...(expired ? {iat: timestampify(+new Date() - 10000), exp: timestampify(+new Date())} : null)
	}, keyData.key, {audience, ...<IKeyDataAlg>(_.pick(keyData, algOption))})
}

export const verifyJwt = (token: string) =>
	new Promise<{sub: string}>((acc, rej) =>
		jwt.verify(token, secretKey, {audience}, (err, decoded: {sub: string}) =>
			err ? rej(err) : acc(decoded)))

const defaultServices = {logger: console}

export const verifyExternalJwt = async (token: string, services = defaultServices): Promise<false | {sub: string}> =>
	await ([jwt.decode(token, {complete: true})].
		map(async ({payload: {sub, aud: audience}, header: {alg}}: {header: {alg: string}, payload: {sub: string, aud: string, alg: "RS256"}}) => {
			try {
				if (alg !== "RS256")
					throw new Error("INVALID_ALGORITHM")
				if (path.join('/aNiceWarmPlace/', audience) !== "/aNiceWarmPlace/" + audience)
					throw new Error("AUDIENCE_CONTAINS_PATH_ALTERNING_WEIRDNESS")
				const publicKey = await fs.readFile(path.join(__dirname, "../../../keys/", audience + ".key.pub"))
				if (jwt.verify(token, publicKey))
					return {sub}
				return false
			} catch (err) {
				services.logger.error(err)
				return false
			}
		})[0]
	)
