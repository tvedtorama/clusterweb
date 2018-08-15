
import {NorwayIntro} from './Norway'
import {DetroitIntro} from './Detroit'
import { ShenzhenIntro } from './Shenzhen';
import { ClustersIntro } from './ClustersIntro';
import { NorwayOil } from './NorwayOil';
import { DetroitDetail } from './DetroitDetail';
import { ValueNetwork } from './ValueNetwork';
import { EnterPhil } from './EnterPhil';
import { PhilFeatures } from './PhilFeatures';
import { ShenzhenDetail } from './ShenzhenDetail';
import { ExtendYourNetwork } from './ExtendsYourNetwork';

export const slideComponentMap = {
	SLIDE_CLUSTERS_INTRO: ClustersIntro,
	SLIDE_NORWAY_INTRO: NorwayIntro,
	SLIDE_NORWAY_OIL: NorwayOil,
	SLIDE_DETROIT_INTRO: DetroitIntro,
	SLIDE_DETROIT_DETAIL: DetroitDetail,
	SLIDE_SHENZHEN_INTRO: ShenzhenIntro,
	SLIDE_SHENZHEN_DETAIL: ShenzhenDetail,
	SLIDE_VALUE_NETWORK: ValueNetwork,
	SLIDE_ENTER_PHIL: EnterPhil,
	SLIDE_EXTEND_YOUR_NETWORK: ExtendYourNetwork,
	SLIDE_PHIL_FETAURES: PhilFeatures,
}

export type ISlideKey = keyof typeof slideComponentMap