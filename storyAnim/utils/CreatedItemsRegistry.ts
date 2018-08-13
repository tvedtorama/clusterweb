import * as Ix from 'ix'

const allButTheOne = (items, id) => items.filter(x => x !== id)

/** Hierarchical tracking of created (visual) items, to allow for clean up
 * when stories exits.
 *
 * Note: This is handled somewhat on theoutside of the story,
 * 	without the story needing to dispatch anything special.  Something similar
 *  could have been archived by tracking this in Redux, but perhaps with less transparancy.
 * Note: Unless, the dispatcher was actually a middleware that added the ownership and hierarchy data
 *  to the dispatched messages.
 * */
export class CreatedItemRegistry {
	constructor(parent?: CreatedItemRegistry) {
		this._parent = parent
	}
	_parent: CreatedItemRegistry
	activeItems: string[] = []
	registerSet(id: string) {
		this.activeItems = [...allButTheOne(this.activeItems, id), id]
	}
	registerDelete(id: string) {
		this.activeItems = allButTheOne(this.activeItems, id)
	}

	childRegistry: Map<string, CreatedItemRegistry> = new Map()
	createAndRegisterChild(childId: string) {
		const newChild = new CreatedItemRegistry();
		this.childRegistry.set(childId, newChild)
		return newChild
	}
	getAllActive(storyId: string): {storyId, itemId}[] {
		return [
			...this.activeItems.map(itemId => ({storyId: storyId, itemId})),
			...Ix.Iterable.from(this.childRegistry).reduce((x, [id, reg]) => [...x, ...reg.getAllActive(id)], [])]
	}
	unregister() {
		if (this._parent) {
			this._parent._ridYourselvesOfChild(this)
		}
	}
	_ridYourselvesOfChild(child: CreatedItemRegistry) {
		for (const pair of this.childRegistry) {
			if (pair[1] === child) {
				this.childRegistry.delete(pair[0])
				break
			}
		}
	}
}