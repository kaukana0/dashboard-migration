// all buttons go into the "slotTop" div, which itself goes into the slot of a card
// TODO: de-dupe slotBottomLeft content (index.html)
export function getCardFragment(id, title, urlFrag, anchorElDomId) {
  return `
    <chart-card id="${id}" header="${title}" urlFrag="${urlFrag}" anchor="anchorExpandedCard">

      <div slot="slotTop" style="height:50px; display:flex;">
        <div id="${anchorElDomId}${id}"></div>
      </div>

      <div slot="slotBottom">
        <range-slider single id="timeRange${id}" thumbWidthInPixel="130" style="width: 100%;"></range-slider>
      </div>

      <div slot="slotBottomLeft">
        <div style="text-align: left; padding-left: 30px;">
          <p>
            <a href="https://ec.europa.eu/info/cookies_en?lang=en&amp;lang=en"><span tabindex="0">Cookies</span></a>
            |
            <a href="https://ec.europa.eu/info/privacy-policy_en?lang=en&amp;lang=en"><span tabindex="0">Privacy policy</span></a>
            |
            <a href="https://ec.europa.eu/info/legal-notice_en?lang=en&amp;lang=en"><span tabindex="0">Legal notice</span></a>
          </p>
        </div>
      </div>

    </chart-card>`
}
