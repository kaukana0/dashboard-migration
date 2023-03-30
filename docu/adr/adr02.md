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

### Retrieval

On demand + caching, because time to initial usage is decreased, the pipeline component supports both and the "best" caching granularity can potentially be empirically determined relatively easy.

Best being, using the least amount of network requests and requesting just about big enough data to ensure a fluid user interaction - assuming an appropriate network connectivity.

### Config

YAML, because it's well comprehendable by humans, can easily be used as json-object in js and offers a useful set of features (i.e. aliases and anchors).

## Consequences

