
import {NorwayIntro} from './Norway'
import {DetroitIntro} from './Detroit'
import { ShenzhenIntro } from './Shenzhen';
import { ClustersIntro } from './ClustersIntro';

export const slideComponentMap = {
	SLIDE_CLUSTERS_INTRO: ClustersIntro,
	SLIDE_NORWAY_INTRO: NorwayIntro,
	SLIDE_DETROIT_INTRO: DetroitIntro,
	SLIDE_SHENZHEN_INTRO: ShenzhenIntro,
}

export type ISlideKey = keyof typeof slideComponentMap