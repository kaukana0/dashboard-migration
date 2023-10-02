import * as MainMenu from "./mainMenu.mjs"
import {getIdFromName} from "./cards/cards.mjs"
import {MS} from "../../common/magicStrings.mjs"

let overviewCardIds = []

export function setOverviewCardIds(ids) {
  overviewCardIds = ids
	if(overviewCardIds.length===0) {
		console.warn("cards: no 'isInOverview' is defined in yaml, so there's no card in the overview")
	}
}

export function getCardsOfCategory(cat) {
  if(cat === MS.TXT_OVERVIEW) {
    return overviewCardIds
  } else {
    const categories = MainMenu.getCategories()
    return categories.get(cat).map( (e)=>getIdFromName(e) )
  }
}
