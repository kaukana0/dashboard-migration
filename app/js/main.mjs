import Yaml from "../redist/js-yaml.mjs"
import * as View from "./view/view.mjs"
import * as LoadScreen from "./view/modules/loadScreen.mjs"
import { isReachable } from "../components/util/util.mjs"
import { setBaseUrl } from "./model/cacheLs.mjs"

function init() {
  console.log("online?", navigator.onLine ? "yes" : "no")

  LoadScreen.show()

  fetch("config/devel.yaml")
    .then((response) => response.text())
    .then((data) => {
      const cfg = Yaml.load(data)
      isReachable(cfg.globals.baseURL, (is) => console.log(`REST endpoint reachable? ${is ? "yes" : "no"}`))
      setBaseUrl(cfg.globals.baseURL)
      View.createUIElements(cfg, true, ()=> {
        View.setupGlobalInfoClick(cfg.globals.texts.globalInfo)
        View.setupSharing(cfg.globals.texts.sharing)
        LoadScreen.hide()
      })
    })
}

init()
