
import {NorwayIntro} from './Norway'
import {DetroitIntro} from './Detorit'
import { ShenzhenIntro } from './Shenzhen';

export const slideComponentMap = {
	SLIDE_NORWAY_INTRO: NorwayIntro,
	SLIDE_DETROIT_INTRO: DetroitIntro,
	SLIDE_SHENZHEN_INTRO: ShenzhenIntro,
}

export type ISlideKey = keyof typeof slideComponentMap