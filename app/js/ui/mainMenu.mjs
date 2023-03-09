export default function create(cfg) {

	// returns map, key=category name, value=[indicator names]
	function getCategories(cfg) {
		const retVal = new Map()
		for(const i in cfg.indicators) {
			const merged = {...cfg.defaults, ...cfg.indicators[i]}
			if(!retVal.has(merged.category)) {
				retVal.set(merged.category, [])
			}
			retVal.get(merged.category).push(merged.name)
			if(merged.isInOverview) {
				//fetchData(merged.name)
			}
		
		}
		return retVal
	}

	//console.log("main menu", getCategories(cfg))

}
