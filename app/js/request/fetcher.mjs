import * as Cache from "./cache.mjs"
import { replaceEuInRawData } from "../../components/util/util.mjs"

import { run } from "../../components/pipeline/pipeline.mjs"
import { process as defineCountryColors } from "../../components/processorCountryColors/countryColors.mjs"
import { process as extractTimeYearly } from "./pipelineProcessors/timeYearly.mjs"
import { process as extractValues } from "./pipelineProcessors/values.mjs"
import { process as createSeriesLabels } from "./pipelineProcessors/seriesLabels.mjs"


export default function go(urls, callback) {
	const processingCfg = []

	for(let i in urls) {
		console.log("fecth", urls[i])
		processingCfg.push(
			{
				input: urls[i],
				//input: "./persistedData/example-request-answer.json",
				cache: {
					store: (data) => Cache.store(urls[i], data),
					restore: (id) => Cache.restore(id)
				},
				//processors: [retrieveSourceData, defineIndexColors, defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly]
				processors: [defineCountryColors, extractTimeYearly, extractValues, createSeriesLabels]
			}
		)
	}

	// todo: lock ui
	run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					callback(data)
					// todo: unlock ui
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


https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/LFSA_ERGACOB?geo=BG&c_birth=NAT&age=Y15-64&sex=T&freq=A&unit=PC&


*/
