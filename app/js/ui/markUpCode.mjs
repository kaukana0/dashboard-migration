export function getSlotFragment(id) {
  return `
    <chart-card id="${id}" anchor="anchorExpandedCard"> 
      <div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
        <div id="anchorSlotContentOfCard${id}"></div>
      </div>
    </chart-card>`
}
