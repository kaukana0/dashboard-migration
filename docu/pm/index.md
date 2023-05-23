# Intro

The task is to create a website for Eurostat B.4, which presents an interactive overview for various Eurostat data.

In ESTAT B.4 terminology, such an overview is called a "dashboard".

The data comes from a REST API from ESTAT.
It's mainly time-series OLAP data with ~6 dimensions about so called "indicators".

The REST endpoint is the only backend needed - the dashboard itself is purely front-end.

There exist already several dashboards.
However, they're architecturally not readily re-usable to fit the requirements of this particular one.

In essence, this dashboard is supposed to be somewhat similar to the "green deal dashboard":
https://ec.europa.eu/eurostat/cache/egd-statistics/

The main differences lie in:
- the look-and-feel: it should adhere to the new stylguide (2022/2023)
- the logic of a certain dropdown-selectBox: it combines two dimensions "c_birth" and "citizen" and allows only for certain combination of selections
- the logic of the max number of lines shown in the line chart (reagrding both, country select and c_birth/citizen select) - see also req600
- the country select box doesn't have "favourites" functionality and behaves differently

For more technical details, please see also the "architecture decision records".


# mock ups

## overview

![](mockup-overview.png)

## line chart

![](mockup-expanded-line.png)

## line chart w/ dropdowns

![](mockup-dropdowns.png)

## vertical connected dot plot

![](mockup-expanded-combi.png)

## tooltip

![](tooltip1.png)
![](tooltip2.png)


# Requirements

## main menu

- req100: ECL style main menu showing "categories" and indicators in each category as dropdown menu

## overview / expanded view

- req200: an area called "overview" showing cards (resposively)
- req220: cards in overview contain a line-chart + legend and some information:
  - Title of the indicator (card title) unit (card subtitle) on the left side
  - Country and latest period displayed (on the right side)
  - "by"-selection as legend
- req240: cards can be expanded to to present more selections and to offer two different charts (switchable): a line-chart (as in the overview) and a dot-plot
- req250: the line chart shows a selection of countries and indicators, the dot plot shows all countries
- req260: time-range slider on the bottom of the charts in expanded view
- req270: info link in expanded card

## chart

- req300: chart tooltip: User can see data for the trend line when mouse overing, year in header, see screenshot
- req350: max line selection logic in expanded card's line chart:
  - In the expanded view, users should have the possibility of selecting two countries more for comparison purposes in the trend line. Max display two countries – 6 lines shown.
  - If users wish to select more countries they should select only one "by"-dimension. Pop up informing when the user tries to select more countries. 

## selectboxes

- req400: generally, all selectboxes will look like ECL, but: 
  - no search functionality, no select all/none, no close button, 
  - merge into main-menu hamburger on small screens
- req420: selectbox component features a "favorite star" functionality: single select star visible on the right - outline when deselected, filled when selected.
  - this is only used in the country select box
- req430: DIMENSION sex: total/woman/men
- req440: DIMENSION age: depends on config for concrete indicator
- req450: it should be possible to add additional dimensions via config, seperately for each indicator

### country selectbox

- req500: in the overview, just 1 country can be selected (country singleselect)
- req520: the country selector is available in the overview and inside every card
- req540: the country selector in the card is multiselect and has "favorite star" functionality
- req560: the country selector in overview is single select, no checkboxes, "favorite star"
- req580: country selectbox favorite star functionality: whatever is selected in expanded, when switching to overview, the favourited country becomes selected in overview
- req590: country selection in dot plot highlites countries

### by selectbox

- req700: "by selectbox": c_birth/citizen combi selectBox ("by-selectbox") should be displayed like this:
  - By country of citizenship 
      - [checkbox] Nationals
      - [checkbox] Citizens of another EU country
      - [checkbox] Citizens of a non-EU country
  - By country of birth
      - [checkbox] Native-born
      - [checkbox] Born in another EU country
      - [checkbox] Born in a non-EU country
  - both groups separated by a line, ECL style
- req750: DIMENSION c_birth/citizen combi selection logic
  - there's no "whole group" checkbox
  - 3 of citiz or 3 of birth selectable, exclusively
  - if 1 of citiz' selected, click on it makes all 3 "of birth" selected - similar for "of birth"
  - if 1 of citiz' selected, click on birth, makes that 1 birth selected, all citiz deselected - similar for "of birth" 
- req770: by-selectbox in dot plot similar to line chart (2 3-groups), min. 1 by-selection is shown (resulting in 1 dot per country)

## default selections

- req800: defaults after loading the page:
  - 12 cards/indicators in the overview (configurable which one)
  - EU is selected
  - For each indicator, display by default 3 lines:
    - nationals
    - EU citizens (other than nationals)
    - Non EU citizens

### export image

- req900: there should be a button that exports currently visible chart to png/jpeg image


# TODOs

- ~~collect requirements (first iteration as a basis)~~ 3/23
- ~~decide for overall approach and general source-code structure~~ 1/23
- ~~decide how to configure what the app displays, datasources and possibly behaviour details~~ 1/23
- ~~decide data retrieval behaviour~~ 1/23
- ~~implement first working prototype (as POC)~~ 4/23
  - ~~fetch data in accordance w/ selection and display multiple lines~~ 4/23
- ~~implement main menu~~
- ~~implement card WebComponent~~ 2/23
- ~~implement line chart~~ 3/23
- ~~solve countryBox being used in 2 different places in DOM~~ 2/23
- ~~implement dropdown Boxes creation from config~~ 3/23
- ~~config & value extraction: consider all differences in metadata regarding dimensions~~ 3/23
- dropdown - update component to follow new style-guide and new functionality:
  - ECL lookalike
  - single, multi (checkbox left)
  - comma separated list of selected
  - blue cirlce in box # of selected
  - fav star
  - "selectionPermitted" callback to implement "dynamic max limit"
  - ~~main-menu merge~~ dropped, because glob-dash doesn't do that either
  - decide route to take: original select mod' OR make component from globdash OR from ICPT OR from scratch
- extend country & by box
  - by&country selectbox logic
  - show # of selectable above box
- overview switch logic
  - reset card selections to default when going into overview
  - fav star logic
- implement time range slider in cards
- implement info link ("info about this indicator") in cards
- implement footer links
- chart - update component to follow new style-guide and new functionality:
  - map for tooltip header similar to series labels (to display alternative to default which is the x label)
  - adapt chart legend
- implement dot plot
  - ~~find an idea about how to draw vertical lines for a vertical connectd dot plot~~
- lock UI selection when loading (potentially avoid out-of-sync situations...?)
- export to image functionality
- compliant looks/styles overall
