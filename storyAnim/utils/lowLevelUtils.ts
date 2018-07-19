export const isUndefined = (value) =>
	value === undefined

export const isFiniteNumber = (value): value is number =>
	typeof value === `number` && Number.isFinite(value)
