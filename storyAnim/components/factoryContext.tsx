import * as React from 'react'

export interface IItemFactory {
	/** Creates visual components from component codes/specs, typically coming from story generators */
	createComponent(name: string): React.ComponentType
}

/** Factory context for passing the context to the StoryAnim react component.  The factory creates
 * visual components from component codes/specs.
 */
export const ItemFactoryContext = React.createContext<IItemFactory>(null)
