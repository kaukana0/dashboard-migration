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
import * as Cache from "./cacheLs.mjs"

import { run } from "../../components/pipeline/pipeline.mjs"
import { process as defineCountriesOrder } from "../../components/processorCountryOrder/countryOrder.mjs"
import { process as defineCountryColors } from "../../components/processorCountryColors/countryColors.mjs"
import { process as extractTimeYearly } from "./pipelineProcessors/timeYearly.mjs"
import { process as extractTimeSeriesData } from "./pipelineProcessors/timeSeries.mjs"
import { process as extractCountrySeriesData } from "./pipelineProcessors/countrySeries.mjs"
import { process as defineByOrder } from "./pipelineProcessors/byOrder.mjs"
import { process as addEu } from "./pipelineProcessors/addEU.mjs"
// this can be pretty helpful for debugging/investigation purposes
import { process as analyzeIncomingData } from "./pipelineProcessors/analyze.mjs"

/*
called per card.

this guy potentially fetches more than a request actually wants.
it's done by omitting geo and time, resulting in a response that includes all geo and all time available on server.

the processors then do the job of extracting a subset which is in accordance to the urls given:
the time-series processor filters out excessive countries and exc. time-range.
and the country-series takes only 1 year but all countries.

the data of the "big request" (unfiltered) is being cached.
*/
export default function go(urls, callback) {
	const processingCfg = []

	// note: some processors can handle being called multiple times
	// meaning, once per URL. they're cumulative, appending data (cols for the chart).
	// others don't work that way.
	for(let i in urls) {
		
		const fullUrl = urls[i]
		const strippedUrl = removeParams(fullUrl)		// more data
		//console.debug("fecth", fullUrl)

		processingCfg.push(
			{
				input: strippedUrl,
				//input: "./persistedData/example-request-answer.json",
				//input: "./persistedData/ausbel.json",
				//input: "./persistedData/dots.json",
				cache: {
					store: (data) => Cache.store(strippedUrl, data),
					restore: (id) => Cache.restore(id)
				},
				processors: [defineCountryColors, defineByOrder, extractTimeYearly, extractTimeSeriesData,
					defineCountriesOrder, extractCountrySeriesData,	addEu,
					analyzeIncomingData],
				data: fullUrl
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
		}
		,replaceInRawData
	)

	function displayFailure(e) {
		//console.error(e)
		//document.getElementById("loadingIndicator").style.display = "none"
		//document.getElementById("errorMessage").style.display = "block"
	}

}

// returns url w/o "geo=.*&" and w/o "time=.*&" params (& or EOL)
function removeParams(url) {
	return url.replace(new RegExp("(time|geo)=[^&]*[^]", "g"), "")
}

export function replaceInRawData(arrayBuffer) {
	var dataView = new DataView(arrayBuffer)
	var decoder = new TextDecoder('utf8')
	try {
		var obj = JSON.parse(
			decoder.decode(dataView)
			.replaceAll("European Union - 27 countries (from 2020)", "European Union")
			.replaceAll("Germany (until 1990 former territory of the FRG)", "Germany")
			)
		return obj
	} catch(e) {
		console.error("main: invalid (json) or no data. native error follows.\n\n", e)
		return {}
	}
}
