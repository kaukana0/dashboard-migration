// any DOM id's in here have to match the html (in case there's a corresponding element there)

// TODO: move file or split it up

export const MS = {
  DS_ID_CITIZEN : "dataset-citizen",
  DS_ID_BIRTH :   "dataset-birth",

  DIM_CITIZEN: "citizen",
  DIM_BIRTH: "c_birth",

  BY_SELECT_ID: "Country of citizenship/birth",

  GEO_SELECT_ID: "geo",
  GEO_SELECT_DOM_ID: "selectCountry",
  GEO_SELECT_CONTAINER_DOM_ID: "selectCountryContainer",

  CARD_CONTAINER_DOM_ID: "cards",
  CARD_SLOT_ANCHOR_DOM_ID: "anchorSlotContentOf-",   // it's the row of selectboxes in a card
  MAIN_AREA_ANCHOR_DOM_ID: "anchorSelectCountryOutsideOfCard",  // above the card-area
  DEFAULT_SELECTED_ATTR: "defaultSelected",
  CARD_DOM_ID_PREFIX: "ChartCard-"
}
