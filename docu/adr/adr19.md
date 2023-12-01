# 19. Detail Legend

Date: 2023-09

## Status

accepted

## Context

When >1 Country of citizenship/birth are selected, the text says "n items selected".
The legend right of the chart aggregates 1 to 3 lines in one item.

As a result the user doesn't know what the lines exactly represent until they hover w/ the mouse inside the chart.

This is problematic - especially when doing a print screen via download button.

## Decision

Add another legend at the bottom left, detailing out the meaning of the lines.
The location is chosen because that's the only open space left.

### Truth table about when to show the detail legend

c = # countries selected

b = # "Country of citizenship/birth" selected



    c b should be shown?

    1 1 false
    2 1 false
    n 1 false

    1 3 true
    2 3 true
    3 3 not possible

    1 2 false  the case only in naturalization rate
    2 2 false
    n 2 false


## Consequences

Extra complexity due to some special-logic about when to show the legend and how many dots/text to show in it.
