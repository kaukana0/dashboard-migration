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
			
			d.forEach(o=>{
					retVal += 
					`<div class="t-b-cl t-text-entry">
						<span class="colorIcon" style="background-color:${color(o)};"></span>
						${o.name}
					</div>
					<div class="t-b-cr t-text-val">${Common.getValText(o.value, context.suffixText)}
					</div>`
				})

			return retVal + "</div>"
		}
	}	
}

export function setHeader(text) { headerText=text }