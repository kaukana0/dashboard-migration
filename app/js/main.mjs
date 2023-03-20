import Yaml from "../redist/js-yaml.mjs"
import {createUIElements} from "./ui/ui.mjs"

function init() {
  //disableEventHandler()
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => createUIElements(Yaml.load(data)))
  //enableEventHandler()
  //triggerEvent()
}


init()
