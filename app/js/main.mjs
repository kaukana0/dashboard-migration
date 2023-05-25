import Yaml from "../redist/js-yaml.mjs"
import {createUIElements} from "./view/ui.mjs"
import "./view/modules/dropDowns/logic.mjs"

function init() {
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => createUIElements(Yaml.load(data), true))
}

init()