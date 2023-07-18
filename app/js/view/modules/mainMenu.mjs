import {MS} from "../../common/magicStrings.mjs"


export function create(onSelect, categories) {
	document.getElementById("menu").onSelect = onSelect
	document.getElementById("menu").data = categories
}


// returns map, key=category name, value=[indicator names]
export function getCategories(cfg) {
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
