# 1. Config and data retrieval

Date: 2023-03

## Status

WIP

## Context

There needs to be a definition of variables/parameters/... to specify which UI elements are "linked" to which data.
The definition format could potentialy be plain text, excel, xml, json, md, yaml, etc.

Also the retrieval of data can be all-at-once-upfront or on-demand ("lazy").
Additionally, a (front end) caching strategy can be employed (for both retrieval methods).

## Decision


Retrieval: On demand + caching, because time to initial usage is decreased and the pipeline component supports both.

Note: Countries are taken from the dataset, not via config. Config only defines the order of countries.

## Consequences

