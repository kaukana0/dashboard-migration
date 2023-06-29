// this project specific tooltips replace the default one which comes with the chart WebComponent

export function tooltipFn2(context) {
	console.debug("tooltip: using project specific tooltip")

  return {
		show: true,
		// this takes care of disappearing when clicking inside the chart.
		// disappearing by clicking anywhere else is up to the user of this component.
		doNotHide: false,
		order: (a, b) => a.value>b.value?-1:1,

		contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
			let retVal = ""

			const headText = context.categories?context.categories[d[0].x]:""
			const head = `<div class="t-head">${headText}</div>`
			retVal += head

			const contentStart = `<div style="display: grid; grid-template-columns: 5fr 1fr;">`
			retVal += contentStart

			d.forEach(o=>{
					const val = Number(o.value).toFixed(1) + (context.suffixText?context.suffixText:"")
					retVal += `<div class="t-b-cl t-text-entry"><span class="colorIcon" style="background-color:${color(o)};"></span>${context.seriesLabels.get(o.id)}</div>
										 <div class="t-b-cr t-text-val">${val}</div>`
				})

			return retVal + "</div>"
		}
	}	
}



export function tooltipFn(context) {
	console.debug("tooltip: using project specific tooltip")

  return {
		show: true,
		// this takes care of disappearing when clicking inside the chart.
		// disappearing by clicking anywhere else is up to the user of this component.
		doNotHide: false,
		order: (a, b) => a.value>b.value?-1:1,


		contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
			let retVal = ""

			const headText = context.categories?context.categories[d[0].x]:""
			const head = `<div class="t-head">${headText}</div>`
			retVal += head

			const contentStart = `<div style="display: grid; grid-template-columns: 5fr 1fr;">`
			retVal += contentStart

			const groups = getGroups(d)
			let i = 0
			for (const [key, val] of groups.entries()) {
				retVal += `<div class="t-b-cl t-text-group-header">${key}</div>
									 <div class="t-b-cr"></div>`
				val.forEach(o=>{
					const val = Number(o.val).toFixed(1) + (context.suffixText?context.suffixText:"")
					retVal += `<div class="t-b-cl t-text-entry"><span class="colorIcon" style="background-color:${color(d[i++])};"></span>${o.text}</div>
										 <div class="t-b-cr t-text-val">${val}</div>`
				})
			}

			return retVal + "</div>"
		}
	}	
}

function getGroups(d) {
	const groups = new Map()	// by country
	d.forEach(e=>{
		const country = e.name.substr(-2)
		const by = e.name.substr(0,e.name.length-4)
		const o = {text:by,val:e.value}
		if(groups.has(country)) {
			groups.get(country).push(o)
		} else {
			groups.set(country,[o])
		}
	})
	return groups
}

export function tooltipCSS() {
    return `
<style>

.colorIcon {
	display: inline-block;
	height: 10px;
	margin-right: 6px;
	width: 10px;
	border-radius: 5px;
}

.t-head {
	padding-top: 15px;
	padding-bottom: 15px;
	text-align: center;
	background-color: #0e47cb;
	color: white;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

/* tooltip border cell left */
.t-b-cl {
	border: 1px solid #CCCC;
	border-top: 0;
	border-right: 0;
}

/* TODO: last */
.t-b-cl-l {
	border-bottom-left-radius: 5px;
}

.t-b-cr {
	border: 1px solid #CCCC;
	border-top: 0;
	border-left: 0;
}

.t-b-cr-l {
	border-bottom-right-radius: 5px;
}

.t-text-group-header {
	padding: 5px;
	font-size: 0.9rem;
	font-weight: 600;
}

.t-text-entry {
	padding: 4px;
}

.t-text-val {
	text-align:right;
	padding-right:5px;
}

#chart1 > div > table > tbody td.name > span {
	border-radius: 5px;
}

</style>
`
}
