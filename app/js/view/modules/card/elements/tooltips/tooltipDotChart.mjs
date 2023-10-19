/* this tooltip
- is project specific
- is for the dot chart
- replaces the default one which comes with the chart WebComponent
*/

import * as Common from "./common.mjs"
import {MS} from "../../../../../common/magicStrings.mjs"

let headerText = ""

export function tooltipFn(context) {
  return {
		contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
			let retVal = Common.pre(headerText)
			const idx = d[0].index+1		// TODO: attention w/ the +1; it assumes a gap! why does this work ok?

			//  access map via index  (⊙_☉)
			retVal += `<div class="t-b-cl t-text-group-header">
				${ context.seriesLabels.get( context.categories[ d[0].index ] ) }
			</div>
			<div class="t-b-cr"></div>`

			let i=0
			d.forEach(o=>{
					const value = context.currentCols[i][idx]===MS.ID_NO_DATAPOINT_COUNTRYSERIES ? MS.ID_NO_DATAPOINT_COUNTRYSERIES : o.value
					retVal += 
					`<div class="t-b-cl t-text-entry">
						<span class="colorIcon" style="background-color:${color(o)};"></span>
						${o.name}
					</div>
					<div class="t-b-cr t-text-val">${Common.getValText(value, context.suffixText, context.decimals)}
					</div>`
					i++
				})

			return retVal + "</div>"
		}
	}	
}

export function setHeader(text) { headerText=text }