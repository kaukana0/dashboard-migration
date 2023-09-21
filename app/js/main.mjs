import Yaml from "../redist/js-yaml.mjs"
import * as View from "./view/view.mjs"
import * as LoadScreen from "./view/modules/loadScreen.mjs"

function init() {
  LoadScreen.show()
  fetch("config/devel.yaml")
    .then((response) => response.text())
    .then((data) => {
      const cfg = Yaml.load(data)
      View.createUIElements(cfg, true)
      View.setupGlobalInfoClick(cfg.globals.texts.globalInfo)
      View.setupSharing(cfg.globals.texts.sharing)
      setTimeout(()=>LoadScreen.hide(), 2000)
    })
}

init()
