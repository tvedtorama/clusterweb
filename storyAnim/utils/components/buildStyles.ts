import Ix from "ix";

export const createBuildStyles = (dimensionDefs: StoryAnimGUI.IStyleDimensionDefs) =>
	[Object.keys(dimensionDefs)].map(dimensionKeys =>
		(animState) =>
			Ix.Iterable.from(dimensionKeys.map(key => ({
				str: dimensionDefs[key].serialize(animState[key]),
				target: dimensionDefs[key].propOutput})
			)).
				groupBy(x => x.target).
				reduce((z, y) => ({
					...z,
					[y.key]: y.reduce((xx, yy) => xx + ' ' + yy.str, "").trim()
				}), {})
	)[0]