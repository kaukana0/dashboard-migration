import {MS} from "../../../../common/magicStrings.mjs"


export function pre(headerText) {
  let retVal = ""

  const head = `<div class="t-head">${headerText}</div>`
  retVal += head

  const contentStart = `<div style="display: grid; grid-template-columns: 5fr 2fr;">`
  retVal += contentStart

  return retVal
}

export function CSS() {
  return `
<style>

.colorIcon {
display: inline-block;
height: 10px;
margin-right: 6px;
width: 10px;
border-radius: 5px;
}

.t-head {
padding-top: 15px;
padding-bottom: 15px;
text-align: center;
background-color: #0e47cb;
color: white;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}

/* tooltip border cell left */
.t-b-cl {
border: 1px solid #CCCC;
border-top: 0;
border-right: 0;
}

/* TODO: last */
.t-b-cl-l {
border-bottom-left-radius: 5px;
}

.t-b-cr {
border: 1px solid #CCCC;
border-top: 0;
border-left: 0;
}

.t-b-cr-l {
border-bottom-right-radius: 5px;
}

.t-text-group-header {
padding: 5px;
font-size: 0.9rem;
font-weight: 600;
}

.t-text-entry {
padding: 4px;
}

.t-text-val {
text-align:right;
padding-right:5px;
padding-top:4px;
}

#chart1 > div > table > tbody td.name > span {
border-radius: 5px;
}

</style>
`
}

export function getValText(val, suffix, decimals) {
	if(val===null) {
		return MS.TXT_NOT_AVAILABLE
	} else {
		return Intl.NumberFormat("en-US",{minimumFractionDigits:decimals}).format(val).replaceAll(","," ") + (suffix?suffix:"")
	}
}