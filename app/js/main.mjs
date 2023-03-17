import Yaml from "../redist/js-yaml.mjs"
import * as Ui from "./ui/ui.mjs"

function init() {
  //disableEventHandler()
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => Ui.createUIElements(Yaml.load(data)))
  //enableEventHandler()
  //triggerEvent()
}


init()
