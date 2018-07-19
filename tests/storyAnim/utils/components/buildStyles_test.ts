import * as chai from 'chai'
import { createBuildStyles } from '../../../../storyAnim/utils/components/buildStyles';

chai.should()

describe("createBuildStyles", () => {

	const testStylesDefs: StoryAnimGUI.IStyleDimensionDefs = {
		a: {
			defaultValue: 10,
			propOutput: "ga",
			serialize: x => `hei ${x}`,
			srcData: src => src.scale,
		},
		b: {
			defaultValue: 5,
			propOutput: "b",
			serialize: x => `hallo ${x}`,
			srcData: src => src.scale,
		},
		bb: {
			defaultValue: 10,
			propOutput: "b",
			serialize: x => `ballo ${x}`,
			srcData: src => src.scale,
		},
		ilBlanko: {
			defaultValue: 10,
			propOutput: "b",
			serialize: x => `ilBlanko ${x}`,
			srcData: src => src.scale,
		}
	}

	it("should compose and group styles and use default when missing", () => {
		const buildStyles = createBuildStyles(testStylesDefs)
		const a = {a: 1, b: 2, bb: 3}
		const styles = buildStyles(a)
		// Note: The defaulting on ilBlanko is not really used runtime as all dimensions are animated, possibly using defaultValue
		styles.should.deep.equal({
			ga: "hei 1",
			b: "hallo 2 ballo 3 ilBlanko 10"
		})
	})

	it("should raise an issue when invalid props are used", () => {
		// Note: this will only happen runtime if the Motion library returns NaN, which it might do if you add and remove springs
		const buildStyles = createBuildStyles(testStylesDefs)
		const a = {a: 1, b: Number.NaN, bb: 3}
		chai.expect(() => buildStyles(a)).to.throw('Style property or default not valid number (NaN?)')
	})
})