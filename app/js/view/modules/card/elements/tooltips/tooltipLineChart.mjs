/*
this tooltip
- is project specific
- replaces the default one which comes with the chart WebComponent
- is for the line chart
- switches between both possible linechart tooltips: GC (groupy by country) and GB (group by "by")
*/

import * as byC from "./tooltipLineChartGC.mjs"
import byB from "./tooltipLineChartGB.mjs"

let byCountry = true

export function setGroupByCountry(trueOrFalse) { byCountry = trueOrFalse }

export function setFilter(ids) { byC.setFilter(ids) }

export function tooltipFn(context) {
  return {
		contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
      return byCountry ? byC.tooltip(context,d,defaultTitleFormat, defaultValueFormat, color) : byB(context,d,defaultTitleFormat, defaultValueFormat, color)
    }
  }
}
