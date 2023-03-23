/*
URL frag					source

Dataset						"by"-selectBox
citizen/c_birth		"by"-selectBox
age								age selectBox
geo								country selectBox
sex								sex selectBox
time							range slider
freq, unit				yaml config file
joker							selectBox

Almost all are per card, except countrySelectbox - it affects all cards.
*/
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
				//input: urls[i],
				input: "./persistedData/example-request-answer.json",
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

