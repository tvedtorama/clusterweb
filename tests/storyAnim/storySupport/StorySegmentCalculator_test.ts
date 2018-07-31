

import * as Chai from 'chai'
import { StorySegmentCalculator } from '../../../storyAnim/storySupport/StorySegmentCalculator';

Chai.should()

const cPos = (n: number) => <StoryAnim.IEventState>{pos: n}

describe("StorySegmentCalculator", () => {
	it("should create segments and functions as you roll", () => {
		const calc = new StorySegmentCalculator()

		const seg1 = calc.addSegment(10)
		const seg2 = calc.addSegment(4, 4)
		const seg3 = calc.addSegment(5, 10)
		const seg4 = calc.addSegment(10)

		seg1.end.should.equal(10)
		seg1.start.should.equal(0)
		seg1.validFunc()(cPos(0)).should.equal(true)
		seg1.validFunc()(cPos(39)).should.equal(true)
		seg1.validFunc()(cPos(40)).should.equal(false)

		seg2.end.should.equal(8)
		seg2.start.should.equal(4)
		seg2.validFunc()(cPos(16)).should.equal(true)
		seg2.validFunc()(cPos(31)).should.equal(true)
		seg2.validFunc()(cPos(32)).should.equal(false)

		seg4.end.should.equal(25)
		seg4.start.should.equal(15)
		seg4.validFunc()(cPos(60)).should.equal(true)
		seg4.validFunc()(cPos(99)).should.equal(true)
		seg4.validFunc()(cPos(100)).should.equal(false)
	})
})