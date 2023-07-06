// this tooltip groups entries by by-selection - "GB" (by citizenship/by birth)

import * as Common from "./common.mjs"

export default function tooltip(context, d, defaultTitleFormat, defaultValueFormat, color) {
	const headText = context.categories?context.categories[d[0].x]:""
	let retVal = Common.pre(headText)

	const groups = getGroups(d)
	let i = 0
	for (const [key, val] of groups.entries()) {
		retVal += `<div class="t-b-cl t-text-group-header">${key}</div>
								<div class="t-b-cr"></div>`
		val.forEach(o=>{
			retVal += 
			`<div class="t-b-cl t-text-entry">
				<span class="colorIcon" style="background-color:${color(d[i++])};"></span>
				${context.seriesLabels.get(o.text)}
			</div>
			<div class="t-b-cr t-text-val">${Common.getValText(o.value, context.suffixText)}</div>`
		})
	}

	return retVal + "</div>"
}

function getGroups(d) {
	const groups = new Map()	// by "by"
	d.forEach(e=>{
		const country = e.name.substr(-2)
		const by = e.name.substr(0,e.name.length-4)
		const o = {text:country,value:e.value}
		if(groups.has(by)) {
			groups.get(by).push(o)
		} else {
			groups.set(by,[o])
		}
	})
	return groups
}

