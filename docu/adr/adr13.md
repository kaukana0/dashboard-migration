# 13. Line-group highligting, Legend and Tooltip

Date: 2023-08

## Status

Accepted

## Context

note: Legend here means the legend right side of the chart.

Req. say, that 3 lines belonging to one country should all be highlighted if one of them is hovered w/ mouse (possibly also touched).
Additionally, hovering over a legend item should higlight also 3 lines.
This functionality ties in with the tooltip - adr07 is being revised - please see also adr07.

## Decision

Extend the functionality of the chart because it doesn't provide this fct.

1. define groups (max. 2)

2. find these elements

    this.shadowRoot.querySelector
    <path class="bb-shape bb-shape bb-line bb-line-EU--Non-EU-Citizens thick-line" ...></path>

3. addEventListener mouseover and mouseout to all of them

4. find others of the group (possibly omit 1.)

5. Highlight/deHighlight

    chart.focus(["series1", "series2", series3]);

## Consequences

Ungeneralized, specific code relies on assumptions about internals of billboardjs - nesting of SVG elements, class-names in dependence of application (even business-) specific names (eg "EU, Non EU Citizens").
Of course changing/updating billboard.js might break this completely.
If business specific naming changes, this has to be adapted.
All in all, not a desireable solution but alternativeless because billboard.js doesn't support this functionality out of the box.
Making this functionality configurable results in additional effort.