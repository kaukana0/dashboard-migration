/*
URL frag					source

Dataset						"by"-selectBox
citizen/c_birth		"by"-selectBox
age								age selectBox
geo								country selectBox
sex								sex selectBox
time							range slider
freq, unit				yaml config file
additional dims		either from a selectBox or from yaml cfg file

Almost all are per card, except countrySelectbox - it affects all cards.
*/
import * as Cache from "./cache.mjs"

import { replaceEuInRawData } from "../../components/util/util.mjs"
import { run } from "../../components/pipeline/pipeline.mjs"
import { process as defineCountryColors } from "../../components/processorCountryColors/countryColors.mjs"
import { process as extractTimeYearly } from "./pipelineProcessors/timeYearly.mjs"
import { process as extractTimeSeriesData } from "./pipelineProcessors/timeSeries.mjs"
import { process as extractCountrySeriesData } from "./pipelineProcessors/countrySeries.mjs"
import { process as createSeriesLabels } from "./pipelineProcessors/seriesLabels.mjs"
import { process as analyzeIncomingData } from "./pipelineProcessors/analyze.mjs"

/*
called per card.

this guy fetches more than each request actually wants.
he does it by omitting geo and time, resulting in a response that includes all geo and all time available on server.

the processors then do the job of extracting a subset which is in accordance to the urls given:
the time-series filters out countries and time-range and the country-series takes only 1 year but all countries.

the data of the "big request" (unfiltered) is being cached.
*/
export default function go(urls, callback) {
	const processingCfg = []

	// note: all relevant processors can handle being called multiple times
	// meaning, once per URL. they're cumulative, appending data (cols for the chart).
	for(let i in urls) {
		console.debug("fecth", urls[i])
		processingCfg.push(
			{
				input: removeParams(urls[i]),
				//input: "./persistedData/example-request-answer.json",
				cache: {
					store: (data) => Cache.store(urls[i], data),
					restore: (id) => Cache.restore(id)
				},
				processors: [defineCountryColors, extractTimeYearly, extractTimeSeriesData, extractCountrySeriesData, createSeriesLabels, analyzeIncomingData],
				data: urls[i]
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


function removeParams(url) {
	return url
}