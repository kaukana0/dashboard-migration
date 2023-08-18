# 7. Tooltips

Date: 2023-06

Revision: 2023-08

## Status

Accepted

## Context

The tooltip situation was initially not specified exact/clear enough and/or not understood in all it's conseqences and nuances.

### Layouts

It turns out that there have to be different tooltip-layouts that can change at runtime as a consequence of user interactions.
The 2 layouts are as follows:
- grouped by Country of citizenship/birth -> only if 1 Country of citizenship/birth selected (and 1 to N geo selections)
- grouped by geo -> in every other case

### Behaviour

In general, it should behave like in any other publication's visualizations.

But there is one exception that is a special case for this visualization (the first of this kind amongst all existing visualizations):
- When having 3 Country of citizenship/birth selected and 2 geo selected, there are 6 lines.
- There should be a tooltip when hovering over one of one geo's lines
  - This tooltip shows only the geo hovered over (grouped by geo).
- There should be no tooltip otherwise, meaning where in all other cases there is a tooltip, in this case, when not hovering over a line, no tooltip is shown.

## Decision

Regarding layouts, the chart WebComponent gets a new feature that allows for replacing the default tooltip - including CSS.
Since this works via callback function, it may be changeable at runtime.

Regarding behaviour,
- the ChartCard gets the ability to inform it's user which line-group is being hovered over
- the tooltip gets the ability to filter
- a "manager" (here, cards.mjs) connects the two accordingly

## Consequences

These changes generate considerable additional effort to keep the component backward compatible.
There is a tradeoff between keeping backward-compatibility and implementing the feature in time.
At least, the "S" in SOLID is somewhat respected.