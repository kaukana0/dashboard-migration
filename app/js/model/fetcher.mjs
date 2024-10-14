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
import * as CacheLs from "./cacheLs.mjs"
import * as CacheInMem from "./cache.mjs"

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

import * as ErrorScreen from "../view/modules/errorScreen.mjs"

var dataRetention = "none"

/*
called per card.

this guy potentially fetches more than a request actually wants.
it's done by omitting geo and time, resulting in a response that includes all geo and all time available on server.

the processors then do the job of extracting a subset which is in accordance to the urls given:
the time-series processor filters out excessive countries and exc. time-range.
and the country-series takes only 1 year but all countries.

the data of the "big request" (unfiltered) is being cached.
*/
export function go(urls, callback) {
	const processingCfg = []

	// note: some processors can handle being called multiple times
	// meaning, once per URL. they're cumulative, appending data (cols for the chart).
	// others don't work that way.
	for(let i in urls) {
		
		const fullUrl = urls[i]
		const strippedUrl = removeParams(fullUrl)		// more data
		//console.debug("fecth", fullUrl)		// typo is on purpose ;-)

		const cfg = {
			input: strippedUrl,
			//input: "./persistedData/example-request-answer.json",
			//input: "./persistedData/ausbel.json",
			//input: "./persistedData/dots.json",
			processors: [defineCountryColors, defineByOrder, extractTimeYearly, extractTimeSeriesData,
				defineCountriesOrder, extractCountrySeriesData,	addEu,
				analyzeIncomingData],
			data: fullUrl
		}

		if(dataRetention==="localstore") {
			cfg["cache"] = {
					store: (data) => CacheLs.store(strippedUrl, data),
					restore: (id) => CacheLs.restore(id)
				}	
		}
		if(dataRetention==="inmemory") {
			cfg["cache"] = {
					store: (data) => CacheInMem.store(strippedUrl, data),
					restore: (id) => CacheInMem.restore(id)
				}	
		}

		processingCfg.push(cfg)
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
		ErrorScreen.show(e)
		if(document.getElementById("loadingIndicator")) {
			document.getElementById("loadingIndicator").style.display = "none"
		}
		if(dataRetention==="localstore") {
			localStorage.clear()
			console.log( `cacheLS: cleared because of failure display` )
		}
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

// one of "inmemory", "localstore" or "none"
export function setDataRetention(val) {
	console.log("set data retention to: "+val)
	dataRetention = val
}