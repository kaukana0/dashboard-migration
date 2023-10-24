/*
slotBottomLeft
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
      const s = `[country="${k.substring(0,2)}"]`
      const u = this.shadowRoot.querySelector(s)
      if(u) { u.innerHTML+=getBlaFragment(v, SHORT2LONG.get(k.substring(4))) }
    })
  }

}

window.customElements.define('detail-legend', Element)


function html() {
return `
<div style="display:flex;">
  <div id="country1" class="country line"></div>
  <div id="dots1" class="bla"></div>
  <div id="country2" class="country" style="margin-left:20px;"></div>
  <div id="dots2" class="bla"></div>
</div>`
}
  

function css() {return `<style>
.bla {
  display:flex;
  flex-direction:column;
}

.dot {
  height: 0.6rem;
  width: 0.6rem;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-right:10px;
}

.country {
  margin-right:10px; 
  padding-right:10px; 
  font-size: 20px;
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
