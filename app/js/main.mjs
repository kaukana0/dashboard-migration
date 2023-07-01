import Yaml from "../redist/js-yaml.mjs"
import {createUIElements} from "./view/view.mjs"
//import "../../redist/html2canvas-1.4.1.js"    // TODO: esm?

function init() {
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => createUIElements(Yaml.load(data), true))
}

init()