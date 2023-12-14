/*
This is a WebComponent.
It is put inside "slotBottomLeft" of a ChartCard.
*/

import {SHORT2LONG} from "../elements/tooltips/labelMapping.mjs"


class Element extends HTMLElement {

	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		const tmp = getHtmlTemplate( html()+css() ).cloneNode(true)
		this.shadowRoot.appendChild(tmp)
	}

  /*
  */
  set content(val) {
    this.shadowRoot.getElementById("country1").innerText = val.countries[0]
    this.shadowRoot.getElementById("dots1").setAttribute("country", val.countries[0])
    this.shadowRoot.getElementById("dots1").innerHTML=""
    this.shadowRoot.getElementById("dots2").innerHTML=""
    this.shadowRoot.getElementById("country2").innerText=""
    if(val.countries[1]) {
      this.shadowRoot.getElementById("country2").innerText=val.countries[1]
      this.shadowRoot.getElementById("country2").classList.add("line")
      this.shadowRoot.getElementById("dots2").setAttribute("country", val.countries[1])
    } else {
      this.shadowRoot.getElementById("country2").classList.remove("line")
    }

    val.dots.forEach((v,k)=>{
      const idx = k.indexOf(",")
      const s = `[country="${k.substring(0,idx)}"]`
      const u = this.shadowRoot.querySelector(s)
      if(u) { u.innerHTML+=getBlaFragment(v, SHORT2LONG.get(k.substring(idx+2))) }
    })
  }

  set show(trueOrFalse) {
    if(trueOrFalse) {
      this.shadowRoot.getElementById("main").style.display = "flex"
    } else {
      this.shadowRoot.getElementById("main").style.display = "none"
    }
  }

}

window.customElements.define('detail-legend', Element)


function html() {
return `
<div id="main" style="display:flex; flex-wrap:wrap;">
  <div style="display:flex; margin-right:20px;">
    <div id="country1" class="country line"></div>
    <div id="dots1" class="bla"></div>
  </div>
  <div style="display:flex;">
    <div id="country2" class="country""></div>
    <div id="dots2" class="bla"></div>
  </div>
</div>`
}
  

function css() {return `<style>
.bla {
  display:flex;
  flex-direction:column;
  font-size: 12px;
  line-height: 20px;
}

.dot {
  min-height: 12px;
  min-width: 12px;
  max-height: 12px;
  max-width: 12px;  /* really nail the size down, otherwise they stretch */
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin: 4px 10px 0 0;
}

.country {
  margin-right:10px; 
  padding-right:10px; 
  font-size: 18px;
  font-weight: bold;
}

.line {
  border-right: 1px solid black;
}

</style>`
}

function getBlaFragment(color, text) {
  return `
  <span style="display:flex;">
    <span class="dot" style="background-color:${color};"></span>
    <span>${text}</span>
  </span>`
}

function getHtmlTemplate(source) {
  const t = document.createElement('template')
  t.innerHTML = source
  return t.content
}
