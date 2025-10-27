# 21. Missing data

Date: 2025-10

## Status

Accepted

## Context

### Symptom of the problem

- When adding Liechtenstein (LI), it is missing in the chart legend and the detail legend is not drawn correctly.
- In contrast to other missing data, a strikethrough grey circle should be in the legend but isn't.

### Cause

- LI is missing in most datasets.
- If a country is completely missing in the data from the server (which is often the case for LI), chart and legend don't know that this country even exists at all,
  - because only what comes back from the server is considered (the outermost loop in timeSeries.mjs iterates over countries coming back from the server).
- But of course, the application knows which countries exist, because it asks the server explicitly for them - all requested countries are listed in the request URL.
- Also, the application knows which countrys are currently selected.
- Noteworthy is also, that if a country comes back from the server with some data and due to the current selection that data isn't currently displayed, everything works as expected.


Approach 1)

- regarding pipeline: run defineCountriesOrder before extractTimeSeriesData
- in timeSeries.mjs: loop over defined countries instead of looping over countries coming back from the server
- if a country is not in the server response, add the country to the pipeline's output anyway but with ID_NO_DATAPOINT_TIMESERIES array entries, so the chart can know about the existence of the country

Approach 2)

- detect which country is selected but not in data returned from server
- add that data similar to approach 1, but it's values are ID_NO_DATA

## Decision

Approach 2, less code has to be changed.

## Consequences

None expected.