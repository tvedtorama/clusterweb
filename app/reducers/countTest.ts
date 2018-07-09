import { Action } from "redux";
import { INCREMENT } from "../components/CountTest";

export const count = (state: number = 0, action: Action) => 
	action.type === INCREMENT ? state + 1 :
		state