import "../components/dropdownBox/dropdownBox.mjs"
import Cards from "./ui/cards.mjs"
import DropDowns from "./ui/dropDowns.mjs"
import MainMenu from "./ui/mainMenu.mjs"


export function createUIElements(cfg) {
  MainMenu(cfg)
  //createRange()  // time
  const c = DropDowns() // geo
  Cards(cfg, c)  // ∀ indicators
}
