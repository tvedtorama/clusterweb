/// <reference path="../../svg.d.ts" />
import * as React from 'react'
import Boat from '../../img/fishingboat.svg'
import OilRig from '../../img/oilRig.svg'

// Note: Could introduce a generic wrapping here, to allow fade out and different kinds of motion.
export const imageComponentMap = {
	HTML_BOAT: props => React.createElement(Boat, {width: 600, height: 450, viewBox: "300 0 700 450", className: "svg-image"}),
	HTML_OIL_RIG: props => React.createElement(OilRig, {width: 800, height: 650, viewBox: "300 0 700 1050", className: "svg-image"}),
}

export type IImageKey = keyof typeof imageComponentMap
