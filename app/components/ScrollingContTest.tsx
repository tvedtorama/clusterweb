import * as React from 'react'
import { StoryItem } from '../../storyAnim/components/StoryItem';
import { ItemFactoryContext, IItemFactory } from '../../storyAnim/components/factoryContext';
import { TestItemViz } from './TestItemVis';
import { WorldMap } from './story/WorldMap';

/** Sample factory, should be extended to return the visual components needed in the visualization */
const factory: IItemFactory = {
	createComponent: (component) => component === "MAP" ? WorldMap : TestItemViz
}

class ScrollingContTestRaw extends React.Component {
	render() {
		return <div className="scroll-test">
			<div className="scrolling-container">
				<div className="sliding-container">
					<ItemFactoryContext.Provider value={factory}>
						<div className="sliding-content">
							<span>Hello</span>
							<StoryItem itemId={"ROOT"} />
						</div>
					</ItemFactoryContext.Provider>
				</div>
			</div>
			<div className="non-scrolling-footer">
				<span>Non-scrolling</span>
			</div>
		</div>
	}
}

export const ScrollingContTest = ScrollingContTestRaw