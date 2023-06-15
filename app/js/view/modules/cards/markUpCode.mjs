// all buttons go into the "slot1" div, which itself goes into the only slot of a card
export function getCardFragment(id, title, urlFrag) {
  return `
    <chart-card id="${id}" header="${title}" urlFrag="${urlFrag}" anchor="anchorExpandedCard">
      <div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
        <div id="anchorSlotContentOfCard${id}"></div>
      </div>
    </chart-card>`
}
