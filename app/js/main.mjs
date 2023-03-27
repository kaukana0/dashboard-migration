import Yaml from "../redist/js-yaml.mjs"
import {createUIElements} from "./view/ui.mjs"

function init() {
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => createUIElements(Yaml.load(data), true))
}

init()
