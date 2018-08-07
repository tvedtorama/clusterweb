
import {NorwayIntro} from './Norway'
import {DetroitIntro} from './Detroit'
import { ShenzhenIntro } from './Shenzhen';
import { ClustersIntro } from './ClustersIntro';
import { NorwayOil } from './NorwayOil';
import { DetroitDetail } from './DetroitDetail';

export const slideComponentMap = {
	SLIDE_CLUSTERS_INTRO: ClustersIntro,
	SLIDE_NORWAY_INTRO: NorwayIntro,
	SLIDE_NORWAY_OIL: NorwayOil,
	SLIDE_DETROIT_INTRO: DetroitIntro,
	SLIDE_DETROIT_DETAIL: DetroitDetail,
	SLIDE_SHENZHEN_INTRO: ShenzhenIntro,
}

export type ISlideKey = keyof typeof slideComponentMap