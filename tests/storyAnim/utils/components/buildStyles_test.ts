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
		}
	}

	it("should compose and group styles", () => {
		const buildStyles = createBuildStyles(testStylesDefs)
		const a = {a: 1, b: 2, bb: 3}
		const styles = buildStyles(a)
		styles.should.deep.equal({
			ga: "hei 1",
			b: "hallo 2 ballo 3"
		})
	})
})