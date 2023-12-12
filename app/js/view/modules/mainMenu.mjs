import {MS} from "../../common/magicStrings.mjs"

let categories

export function create(cfg, onSelect) {
	document.getElementById("menu").onSelect = onSelect
	categories = _getCategories(cfg)
	document.getElementById("menu").data = categories
}

export function getCategories() {return categories}

// returns map, key=category name, value=[indicator names]
function _getCategories(cfg) {
	const retVal = new Map()
	retVal.set(MS.TXT_OVERVIEW,[])
	for(const i in cfg.indicators) {
		const merged = {...cfg.defaults, ...cfg.indicators[i]}
		if(!merged.ignore) {
			if(!retVal.has(merged.category)) {
				retVal.set(merged.category,[merged.name])
			} else {
				retVal.get(merged.category).push(merged.name)
			}
		}
	}
	return retVal
}

export function select(menuId) {
	if(categories) {
		document.getElementById("menu").select(menuId)
	} else {
		console.error("MainMenu: no categories")
	}
}

// returns [main-menu-id, sub-menu-id]
export function getMenuItemIds(cardId) {
	let retVal = ["",""]
	const searchFor = cardId.replace(MS.CARD_DOM_ID_PREFIX,"").replaceAll(" ","-")
	for (const [key, val] of categories.entries()) {
		val.forEach(e=>{
			if(e.replaceAll(" ","-") === searchFor) {retVal = [key,e]}
		})
	}
	return retVal
}

export function close() {
	document.getElementById("menu").close()	
}
