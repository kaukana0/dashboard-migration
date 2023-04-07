export function getCardFragment(id, title, urlFrag, zroot, zback, zfront) {
  return `
    <chart-card id="${id}" header="${title}" urlFrag="${urlFrag}" anchor="anchorExpandedCard" zroot="${zroot}" zback="${zback}" zfront="${zfront}">
      <div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
        <div id="anchorSlotContentOfCard${id}"></div>
      </div>
    </chart-card>`
}
