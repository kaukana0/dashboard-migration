import Yaml from "../redist/js-yaml.mjs"
import * as Ui from "./ui.mjs"

export default function _() {
  //disableEventHandler()
  fetch("config/devel.yaml")
  .then((response) => response.text())
  .then((data) => Ui.createUIElements(Yaml.load(data)))
  //enableEventHandler()
  //triggerEvent()
}
