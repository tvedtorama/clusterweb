// Note, will never return max, only an integer lower than max
export const generateCryptoRandomNumber = async (max: number) => {
	const numBytes = Math.ceil(Math.log2(max) / 8)
	// Note: this method fails to fall out by webpack tree shaking, hence the crypto package was converted to a dynamic dependency.
	const bytes = await import(/* webpackChunkName: "crypto" */ 'crypto').then(({randomBytes}) => new Promise<Buffer>((acc, rej) =>
		randomBytes(numBytes, (err, buf) => err ? rej(err) : acc(buf))))
	const theNumber = bytes.reduce((x, y) => x * 256 + y)
	return theNumber % max
}
