
import {NorwayIntro} from './Norway'
import {DetroitIntro} from './Detorit'

export const slideMap = {
	SLIDE_NORWAY_INTRO: NorwayIntro,
	SLIDE_DETROIT_INTRO: DetroitIntro,
}

export type ISlideKey = keyof typeof slideMap