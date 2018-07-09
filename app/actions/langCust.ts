import {Action} from 'redux'

export const SELECT_LANGUAGE = "SELECT_LANGUAGE"
export const ADD_OVERRIDE = "ADD_OVERRIDE" // ATW: No GUI / functions, just reducer impl

export interface IAddOverride extends Action {
	override: string
}

export interface ISelectLanguage extends Action {
	lang: string
}

export const selectLanguage = (lang: string): ISelectLanguage => ({type: SELECT_LANGUAGE, lang})

export const addOverride = (override: string): IAddOverride => ({type: ADD_OVERRIDE, override})
