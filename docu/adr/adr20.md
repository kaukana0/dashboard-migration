# 20. Icons in Menu Line

Date: 2023-12

## Status

WIP

## Context

Here's an overview of what's happening at different screen widths.
Most of it is CSS but some things are in JS.

    < 529 (very narrow)
      chartCard chartContainer height

    < 540 and expanded
      back | Info, Share, Menu icon

    > 480
      | Info, Share, Menu icon

    < 995 (narrow)
      ELC menu becomes hamburger
      expanded chartCard buttons move to row 2

    > 995 
      expanded menu | Info, Share

The line separates left-align from right-align.


- "max-width" means <
- "min-width" means >=

## Decision


## Consequences

