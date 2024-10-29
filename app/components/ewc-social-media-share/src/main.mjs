import HTML from  "./html.mjs"		// keep this file html/css free


class Element extends HTMLElement {

	#text = ""
	#hashTags = ""
	#mailSubject = ""
	#mailBody = ""
	#callback
	#isInitialized=false
	#buttonVisible=true
	#xoffset=-125+15 		// see CSS .ewc-social-media-share
	#showembed=true

	constructor() {	
		super()	
	}

	connectedCallback() {
		if(this.#isInitialized) { return } else { this.#isInitialized=true }

		this.appendChild(HTML(this.getAttribute("assetBaseURL") ?? undefined, this.#showembed))
		this.#installEventHandlers()
		if(this.#buttonVisible===false) {
			this.querySelector(".ewc-button").style.display="none"
		}
		this.#makeDismissable()
	}

	static get observedAttributes() { return ["text", "hashtags", 
		"mailsubject", "mailbody", "buttonvisible", "xoffset", "showembed"] }

	attributeChangedCallback(name, oldVal, newVal) {
		if(name==="text") { this.#text = newVal	}
		if(name==="hashtags") { this.#hashTags = newVal	}
		if(name==="mailsubject") { this.#mailSubject = newVal	}
		if(name==="mailbody") { this.#mailBody = newVal	}
		if(name==="buttonvisible") { 
			if(newVal==="false") { this.#buttonVisible = false }
		}
		if(name==="xoffset") { this.#xoffset = newVal}
		if(name==="showembed") { this.#showembed = newVal==="true"}
	}

	set callback(val){
		this.#callback = val
	}

	show() {
		this.querySelector(".ewc-pseudopopover__container").style.display = "block"
		const btnX = Number(this.getBoundingClientRect().left)
		const x = btnX + Number(this.#xoffset)
		this.querySelector(".ewc-pseudopopover__container").style.left = x + "px"
	}
	hide() {
		this.querySelector(".ewc-pseudopopover__container").style.display="none"
	}
	toggleVisibility() {
		this.querySelector(".ewc-pseudopopover__container").style.display = this.querySelector(".ewc-pseudopopover__container").style.display==="none"?this.show():this.hide()
	}

	#installEventHandlers() {
		this.#installMenuEventHandlers()
		this.querySelector(".ewc-button").addEventListener("click", e=>{
			this.show()
			this.querySelector(".ewc-social-media-share__list").firstElementChild.focus()
		})
		this.querySelector(".ewc-button").addEventListener("keydown", function(e){
			if(e.key==="ArrowDown") {
				e.preventDefault()
				this.show()
				this.querySelector(".ewc-social-media-share__list").firstElementChild.focus()
			}
			if(e.key==="Escape") {
				e.preventDefault()
				this.hide()
				this.querySelector(".ewc-button").focus()
			}
		}.bind(this))
		this.querySelector(".ewc-pseudopopover__container").addEventListener("keydown", e=>{

			handle("ArrowDown", e=>e.nextElementSibling, e=>e.parentNode.firstElementChild)
			handle("ArrowUp", e=>e.previousElementSibling, e=>e.parentNode.lastElementChild)
			if(e.key==="Escape") {
				e.preventDefault()
				this.hide()
				this.querySelector(".ewc-button").focus()
			}

			function handle(key, direction, direction2) {
				if(e.key===key) {
					e.preventDefault()
					const el = direction(e.target.closest("li"))
					if(el) {
						el.focus()
					} else {
						direction2(e.target.closest("li")).focus()
					}
				}	
			}

		})
	}

	#installMenuEventHandlers() {
		const cfg = {
			"Email": e=> {
				window.open(this.#buildURLmail(this.#mailSubject, this.#mailBody))
			},
			"Facebook": e=> {
				window.open(this.#buildURLfb(this.#text))
			},
			"X": e=> {
				window.open(this.#buildURLx(this.#text, this.#hashTags))
			},
			"Linkedin": e=> {
				window.open(this.#buildURLLinkedIn())
			}
		}
		if(this.#showembed) {
			cfg["Embed"] = e=> {
				if(this.#callback) {this.#callback(Element.getURLFromOGTag())}
			}
		}
		for (const p in cfg) {
			const query = ".ewc-social-media-share__item." + p
			this.querySelector(query).addEventListener("click", cfg[p])
			this.querySelector(query).addEventListener("keydown", ev => {
				if(ev.key=="Enter") {
					this.hide()
					cfg[p](ev)
				}
			})
		}
	}


	#buildURLmail(s,b) {
		return `mailto:?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`
	}

	#buildURLfb(text) {
		return "https://www.facebook.com/sharer/sharer.php?u=" +
				encodeURIComponent(window.location.href) +
				'&t=' +
				encodeURIComponent(text)
	}

	#buildURLx(text, hashtags) {
		let retVal = 'https://twitter.com/intent/tweet'
		retVal += '?hashtags=' + encodeURIComponent(hashtags)
		retVal += '&text=' + encodeURIComponent(text)
		const rootPath = window.location.protocol + '//' + window.location.host + window.location.pathname + '?lang=' + String.locale
		retVal += '&url=' + encodeURIComponent(rootPath)
		return retVal
	}

	#buildURLLinkedIn() {
		return "https://www.linkedin.com/sharing/share-offsite/?url=" +
				encodeURIComponent(window.location.href)
	}

	static getURLFromOGTag() {
		const el = document.querySelector("meta[property='og:url']")
		if(el) {
			return el.getAttribute("content")
		}
		return ""
	}

	#makeDismissable() {
		document.addEventListener('click', (e) => {
			if(e.target.closest("ewc-social-media-share") !== this) {
				this.hide()
			}
		})
	}

}

export function socialMediaShareEmbedCallback(url, ewcDialog) {
	ewcDialog.title = "Embed visualisation"
	ewcDialog.textContent = `<iframe width="100%" height="800" src="${url}/index.html"></iframe>`
	ewcDialog.visible = true
}

window.customElements.define('ewc-social-media-share', Element)
