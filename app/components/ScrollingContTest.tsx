import * as React from 'react'
import { StoryItem } from '../../storyAnim/components/StoryItem';
import { ItemFactoryContext, IItemFactory } from '../../storyAnim/components/factoryContext';
import { TestItemViz } from './TestItemVis';
import { slideComponentMap } from './slides';
import { imageComponentMap } from './images';
import { Heading } from './Heading';

// Why isn't this part of Typescript? Example fetched from documentation.
type Unpacked<T> =
	T extends (infer U)[] ? U :
	T extends (...args: any[]) => infer U ? U :
	T extends Promise<infer U> ? U :
	T;

const loadWorldMap = import(/* webpackChunkName: "world-map" */ './story/WorldMap')
type WorldMapModule = typeof loadWorldMap // ReturnType<typeof loadWorldMap>
type WorldMapType = Unpacked<WorldMapModule>["WorldMap"]
let WorldMap: WorldMapType = null
loadWorldMap.then(x => WorldMap = x.WorldMap)

/** Sample factory, should be extended to return the visual components needed in the visualization */
const factory: IItemFactory = {
	createComponent: (component) => component === "MAP" ?
			WorldMap :
		component in slideComponentMap ? slideComponentMap[component] :
		component in imageComponentMap ? imageComponentMap[component] :
			TestItemViz
}

class ScrollingContTestRaw extends React.Component {
	componentDidMount() {
		if (!WorldMap) {
			loadWorldMap.then(x => this.forceUpdate())
		}
	}
	render() {
		if (!WorldMap) {
			return <div className="loading" />
		}
		return <div className="scroll-test">
			<Heading />
			<div className="scrolling-container">
				<div className="sliding-container">
					<ItemFactoryContext.Provider value={factory}>
						<div className="sliding-content">
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