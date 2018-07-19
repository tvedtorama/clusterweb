import Ix from "ix";
import { isUndefined, isFiniteNumber } from "../lowLevelUtils";

const getNumberWithDefault = (defaultValue: number, animStateValue?: number) =>
	[isUndefined(animStateValue) ? defaultValue : animStateValue].map(v =>
		isFiniteNumber(v) ? v : (() => {throw new Error("Style property or default not valid number (NaN?)")})())
	[0]

export const createBuildStyles = (dimensionDefs: StoryAnimGUI.IStyleDimensionDefs) =>
	[Object.keys(dimensionDefs)].map(dimensionKeys =>
		(animState) =>
			Ix.Iterable.from(dimensionKeys.map(key => ({
					def: dimensionDefs[key],
					key
				})).
				map(({def, key}) => ({
					str: def.serialize(getNumberWithDefault(def.defaultValue, animState[key])),
					target: def.propOutput})
				)
			).
			groupBy(x => x.target).
			reduce((z, y) => ({
				...z,
				[y.key]: y.reduce((xx, yy) => xx + ' ' + yy.str, "").trim()
			}), {})
	)[0]