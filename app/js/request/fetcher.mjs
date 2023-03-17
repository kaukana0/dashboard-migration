import * as Cache from "./cache.mjs"
import { replaceEuInRawData } from "../../components/util/util.mjs"

import { run } from "../../components/pipeline/pipeline.mjs"
import { process as retrieveSourceData } from "./pipelineProcessors/sourceData.mjs"


export default function go(urls) {
	console.log("fetching", urls)

	const processingCfg = []

	for(let i in urls) {
		processingCfg.push(
			{
				input: urls[i],
				cache: {
					store: (data, id) => Cache.store(data, id),
					restore: (id) => Cache.restore(id)
				},
				//processors: [retrieveSourceData, defineIndexColors, defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly]
				processors: [retrieveSourceData]
			}
		)
	}


	run(
		processingCfg,
		(data) => {
			console.log(data)
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					//const max = data.categories.time.length
					//const left = 15*12
					//slider.init(data, left, max, onSliderSelected.bind(this, data))
					//updateChart()
					//document.getElementById("timeRange").style.visibility="visible";
				} catch(e) {
					displayFailure(e)
				}
			} else {
				displayFailure("emtpy data")
			}
		},
		(e) => {
			displayFailure(e)
		},
		replaceEuInRawData
	)

	function displayFailure(e) {
		console.error(e)
		//document.getElementById("loadingIndicator").style.display = "none"
		//document.getElementById("errorMessage").style.display = "block"
	}

}

/*

DS  age=  citizen=  geo=  sex=  time=  freq=  unit=
DS  age=  cbirth=   geo=  sex=  time=  freq=  unit=

			geo					cit+cbi			sex 	time		f		u		joker
UI		countryBox	byBox			sexBox	range		-   -		?
			glob				combined	perI		perI						perI
									perI
data	geo					DS1		DS2		sex		time	fix 	fix		?


ui.global.dropdown.*
ui.perI.combined.dropdown.*
ui.perI.single.dropdown.*
ui.perI.single.range.*





*/
