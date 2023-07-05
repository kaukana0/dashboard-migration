# 8. Range slider input

Date: 2023-07

## Status

Accepted

## Context

In each card there needs to be a slider w/ 1 handle below the chart to select a time-range.

alternatives:

1. use already existing WebComponent, but since it has 2 sliders, modify it to work with just 1
2. implement from scratch as WebComponent
3. implement from scratch not as WebComponent
4. use any library

## Decision

1, because estimation of modification effort is low

## Consequences

Regression, style has to be adapted a little bit.
