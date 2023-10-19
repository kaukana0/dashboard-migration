// all buttons go into the "slotTop" div, which itself goes into the slot of a card
// TODO: de-dupe slotBottomLeft content (index.html)
export function getCardHtmlString(id, title, longTitle, urlFrag, anchorElDomId) {
  return `
    <chart-card id="${id}" header_c="${title}" header_e="${longTitle}" urlFrag="${urlFrag}" anchor="anchorExpandedCard">

      <div id="${anchorElDomId}${id}" slot="slotTop" style="height:50px; display:flex;">
      </div>

      <div slot="slotBottom">
        <div style="margin: 0px 15% 0px 10%;">
          <range-slider single id="timeRange${id}" thumbWidthInPixel="130"></range-slider>
        </div>
      </div>

    </chart-card>`
}
