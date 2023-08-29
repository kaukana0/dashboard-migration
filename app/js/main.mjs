import Yaml from "../redist/js-yaml.mjs"
import * as View from "./view/view.mjs"
//import "../../redist/html2canvas-1.4.1.js"    // TODO: esm?
import * as LoadingIndicator from "./view/modules/loadingIndicator.mjs"

function init() {
  LoadingIndicator.show()
  fetch("config/devel.yaml")
    .then((response) => response.text())
    .then((data) => {
      const cfg = Yaml.load(data)
      View.createUIElements(cfg, true)
      View.setupGlobalInfoClick(cfg.globals.texts.globalInfo)
      View.setupSharing(cfg.globals.texts.sharing)
      setTimeout(()=>LoadingIndicator.hide(), 2000)
    })
}

init()
