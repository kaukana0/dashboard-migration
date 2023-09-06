/* this tooltip
- is project specific
- is for the dot chart
- replaces the default one which comes with the chart WebComponent
*/

import * as Common from "./common.mjs"

let headerText = ""

export function tooltipFn(context) {
  return {
		contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
			let retVal = Common.pre(headerText)

			//  access map via index  (⊙_☉)
			retVal += `<div class="t-b-cl t-text-group-header">
				${ context.seriesLabels.get( context.categories[ d[0].index ] ) }
			</div>
			<div class="t-b-cr"></div>`

			d.forEach(o=>{
					retVal += 
					`<div class="t-b-cl t-text-entry">
						<span class="colorIcon" style="background-color:${color(o)};"></span>
						${o.name}
					</div>
					<div class="t-b-cr t-text-val">${Common.getValText(o.value, context.suffixText, context.decimals)}
					</div>`
				})

			return retVal + "</div>"
		}
	}	
}

export function setHeader(text) { headerText=text }