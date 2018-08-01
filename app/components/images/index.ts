/// <reference path="../../svg.d.ts" />
import Boat from '../../img/fishingboat.svg'

// Note: Could introduce a generic wrapping here, to allow fade out and different kinds of motion.
export const imageComponentMap = {
	HTML_BOAT: Boat
}

export type IImageKey = keyof typeof imageComponentMap
