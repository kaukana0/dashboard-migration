import "../components/dropdownBox/dropdownBox.mjs"
import Cards from "./ui/cards.mjs"
import * as DropDowns from "./ui/dropDowns.mjs"
import MainMenu from "./ui/mainMenu.mjs"
import Handler from "./eventHandler.mjs"


export function createUIElements(cfg) {
  MainMenu(cfg)
  //createRange()  // time
  console.log("*",cfg)
  const dc = DropDowns.fillCountries(cfg.globals.ui.dropdown.geo)
  const cardIds = Cards(cfg, dc)  // ∀ indicators
  for(const cardId of cardIds) {
    document.getElementById(cardId).addEventListener("dropdownSelect", (e) => Handler(e))
  }
}
