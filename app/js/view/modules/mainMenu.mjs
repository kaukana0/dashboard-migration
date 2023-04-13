export default function create(cfg) {

	// returns map, key=category name, value=[indicator names]
	function getCategories(cfg) {
		const retVal = new Map()
		retVal.set("Overview",[])
		for(const i in cfg.indicators) {
			const merged = {...cfg.defaults, ...cfg.indicators[i]}
			if(!retVal.has(merged.category)) {
				retVal.set(merged.category,[merged.name])
			} else {
				retVal.get(merged.category).push(merged.name)
			}
		}
		return retVal
	}

	document.getElementById("menu").data = getCategories(cfg)

}
