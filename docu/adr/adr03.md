# 3. Mapping config to UI elements and requesting data

Date: 2023-03

## Status

Accepted

## Context

One fundamental question is about how to create UI elements and how to request and process data associated with UI element selections.

### data and URL

URL for requesting line diagram data:

    ILC_PEPS06N?c_birth=NAT&age=Y20-24&sex=T&geo=BG&geo=EU&freq=A&unit=PC&time=from..to

URL for requesting dot plot data:

    ILC_PEPS06N?c_birth=NAT&age=Y20-24&sex=T&freq=A&unit=PC&

the dot plot URL leaves out geo and time, gets more data, rest is similar.

**insight: line-data is a subset of dotplot-data.**


### what and when?

- geo select -> requests for all cards
- any other select -> request for one card

fetcher, pipeline

### reaching a conclusion

The following sketchily documented ideas show the evolution which cumulate in a conclusion.

idea-fragment 1:
- stick w/ url building
- processors convert/transform (!) and (an intelligent) cache extracts
- cache does a broad request and returns a subset
- for that, pipeline output object gets inited w/ 1 info: the URL
  - but how would the cache get a subset, given a url
  
-> don't like the whole URL assemble and parse aspect of that

idea-fragment 2:
- intermediate representation of all data
- get a subset of data by dropdownbox key

-> don't like to think about format of this interm. repr. - it's complex

idea-fragment 3:
- keep convert vs extraction semantic/idea
- the cache souldn't do extraction
- but who - and based on what input (URL or dropdownbox keys)

-> extra info can be put in config and made available to processors

## Decision

This is how it will work:

- collect selections (values of dropdownBox)
- make original-URL from it - mirroring exactly what was selected
- make request-URL by stripping geo and time from original-URL, therefore requesting more data than what was selected
- request, retrive and cache data
- put data through a processing-pipeline, extracting/filtering a subset of all data according to original URL
- output of that pipeline is data in a format needed by billboard.js (line and bubble chart)

Notes: 

- the "more data than was selected" is needed by the dot plot chart, which shows all countries at a user-selectable year.
- the line chart needs only a subset of that data.
- on user selection the whole pipeline is executed again (ie from raw data to billboard.js suitable data), but raw data is served from the cache instead via network.
- see also [the big idea](../technical/theBigIdea.md)

## Consequences

