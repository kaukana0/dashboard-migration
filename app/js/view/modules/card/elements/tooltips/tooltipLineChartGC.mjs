// this line chart tooltip groups entries by country ("GC")

import * as Common from "./common.mjs"
import {SHORT2LONG} from "./labelMapping.mjs"

let filter = []

export function tooltip(context, d, defaultTitleFormat, defaultValueFormat, color) {
	const groups = getGroups(d)

	if(groups.size>0) {
		const headText = context.categories?context.categories[d[0].x]:""
		let retVal = Common.pre(headText)
	
		for (const [key, val] of groups.entries()) {
			retVal += `<div class="t-b-cl t-text-group-header">${context.seriesLabels.get(key)}</div>
									<div class="t-b-cr"></div>`
			val.forEach(o=>{
				retVal += 
				`<div class="t-b-cl t-text-entry">
					<span class="colorIcon" style="background-color:${color(d[o.index])};"></span>
					${SHORT2LONG.get(o.text)}
				</div>
				<div class="t-b-cr t-text-val">${Common.getValText(o.value, context.suffixText, context.decimals)}</div>`
			})
		}
	
		return retVal + "</div>"

	} else {
		return null
	}
}

// it's a "discard everything else" type filter
export function setFilter(ids) { filter = ids }

function getGroups(d) {
	const groups = new Map()	// by country
	let i = 0
	d.forEach(e=>{
		const country = e.name.substr(0,2)
		if(filter.length===0 || filter.includes(country)) {
			const by = e.name.substr(4)
			const o = {text:by,value:e.value,index:i}		// need the original index for d[] access later
			if(groups.has(country)) {
				groups.get(country).push(o)
			} else {
				groups.set(country,[o])
			}
		}
		i++
	})
	return groups
}

