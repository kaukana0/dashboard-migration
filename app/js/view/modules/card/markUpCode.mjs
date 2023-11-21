/*
markup for a card
all buttons go into the "slotTop" div, which itself goes into the slot of a card

TODO: de-dupe slotBottomLeft content (index.html)
*/
export function getCardHtmlString(id, title, longTitle, urlFrag, anchorElDomId) {
  return `
    <chart-card id="${id}" header_c="${title}" header_e="${longTitle}" urlFrag="${urlFrag}" anchor="anchorExpandedCard">

      <!-- CARD_SLOT_ANCHOR_DOM_ID -->
      <div id="${anchorElDomId}${id}" slot="slotTop" style="display:flex; flex-wrap:wrap; gap:20px;">
      </div>

      <div slot="slotBottom">
        <div style="margin: 0px 15% 0px 10%;">
          <range-slider single id="timeRange${id}" thumbWidthInPixel="130"></range-slider>
        </div>
      </div>

      <div slot="slotBottomLeft" style="margin-top:15px; display:flex; flex-wrap:wrap;">
        <detail-legend id="detailLegend-${id}" style="display:flex; flex-wrap:wrap;"></detail-legend>
      </div>
      
    </chart-card>`
}
