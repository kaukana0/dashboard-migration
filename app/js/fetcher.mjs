import * as Cache from "./cache.mjs"



export default function fetch(bla) {
	//updateCards( fetchData( getFrags( getMetadataFromUIElements(), cfgObj ) ) )
	console.log("fetch", bla)

	const processingCfg = [
		{
				input: getURL(),
				cache: {
					store: (data, id) => Cache.store(data, id),
					restore: () => Cache.restore(id)
				},
				//processors: [retrieveSourceData, defineIndexColors, defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly]
				processors: []
		}
	]

/*
	pipeline.run(
		processingCfg,
		(data) => {
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
*/

	function displayFailure(e) {
		console.error(e)
		//document.getElementById("loadingIndicator").style.display = "none"
		//document.getElementById("errorMessage").style.display = "block"
	}

}

//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2005-01&endPeriod=2009-12",
function getURL(cfg) {

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
