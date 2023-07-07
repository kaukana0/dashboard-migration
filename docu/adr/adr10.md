# 9. Chart colors

Date: 2023-07

## Status

Accepted

## Context

Some requirements result in a certain logic for giving colors to lines (in line chart) and dots (in the dot plot).

### line chart

The following table shows the possible numbers of geo and "by" selected and how to color the resulting lines:

    #geo	  #by    color assignment

      1      1     Same 3-color-set for any selected country
      1      3     "
      2      1     1st country one 3-color-set, 2nd country a different one
      2      3     "
      >2     1     dynamic

For all the above, EU is an exception, it always has it's own 3-color-set, different from every other (3 shades of blue).

#### Note

Why "3 color set"?

It's because of the 2*3 possible "by" selections: {Nationals, EU Citizens, Non EU Citizens} or {Native-born, EU Born, Non EU Born}.

Nationals and Native-born have color 1, EU Citizens and EU Born have color 2, ... color 3

Not always does the data contain all 3 "by" datapoints.

### dot plot

In the dot plot, all countries except EU have the same 3 colors (for each by select, respectively).

That means, in this case the colors are dependend on the category (x axis), not on the series.

## Decision

Given billboard.js, which is encapsulated within the chart WebComponent, the following implementation can acommodate the requirements.

### line chart

- Each series label is a quasi-compound key containing "by"-label appended with a country code (e.g. "Citizens of another EU country, EU")
- it has to be noticed that the color assignment is independent of the number of by-selects
  - when assuming that if >2 geos are selected, only 1 "by" can be selected
- technically, assigning colors can be implemented via fixColors feature of the chart WebComponent
  - the fixColors feature works by assigning a color to a series
- as a result, the only information neccessary to assign colors is which geos are selected

### dot plot

fixColors can't be used for this, because in this case there's no series to be colored but categories.

For the dot plot requirement, the chart WebComponent has to be extended to feature an overwriteable coloring function.
One argument of that function is the index of an entry in question.
That way an chart-external function can provide a color dependent on the index (i.e. the category).

## Consequences

One part of the requirement can not be satisfied w/ current features of the chart WebComponent, so enhancing it could lead to regressions.
