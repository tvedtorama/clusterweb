import * as chai from 'chai'
import { ownershipArrayReducer } from '../../../../storyAnim/utils/redux/ownershipArrayReducer';

chai.should()

describe("ownershipArrayReducer", () => {
	it("should correctly insert", () => {
		const reducer = ownershipArrayReducer("STORE")
		const resultSimple = reducer([{id: "a", owners: []}], {type: "STORE", payload: {id: "b", owners: ["me"]}})
		resultSimple.should.deep.equal([{
				id: "a",
				owners: [],
			}, {
				id: "b",
				owners: ["me"],
			}
		])

		const resultMoreOwners = reducer(resultSimple, {type: "STORE", payload: {id: "b", owners: ["he", "me"]}})
		resultMoreOwners.should.deep.equal([{
				id: "a",
				owners: [],
			}, {
				id: "b",
				owners: ["me", "he"],
			}
		])
	})

	it("should remove owners and delete", () => {
		const reducer = ownershipArrayReducer("IRRELEVANT", "DELETE")

		const resultOwnerRemoved = reducer([{
					id: "a",
					owners: [],
				}, {
					id: "b",
					owners: ["me", "he"],
				}
			], {type: "DELETE", payload: {id: "b", owners: ["he"]}})

		resultOwnerRemoved.should.deep.equal([{
				id: "a",
				owners: [],
			}, {
				id: "b",
				owners: ["me"],
			}
		])

		const resultAllOwnersRemoved = reducer(resultOwnerRemoved, {type: "DELETE", payload: {id: "b", owners: ["me"]}})

		resultAllOwnersRemoved.should.deep.equal([{
				id: "a",
				owners: [],
			}
		])

	})

	it("should delete unconditionally when no owner in payload", () => {
		const reducer = ownershipArrayReducer("IRRELEVANT", "DELETE")

		const resultDelete = reducer([{
					id: "a",
					owners: [],
				}, {
					id: "b",
					owners: ["me", "he"],
				}
			], {type: "DELETE", payload: {id: "b"}})

		resultDelete.should.deep.equal([{
				id: "a",
				owners: [],
			}
		])

	})

})