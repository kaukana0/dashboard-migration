# 7. Tooltips

Date: 2023-06

## Status

Accepted

## Context

The tooltip situation was initially not specified exact/clear enough.
It turns out that there have to be different tooltip-layouts that can change at runtime as a consequence of user interactions.

## Decision

the chart WebComponent gets a new feature that allows for replacing the default tooltip - including CSS.
Since this works via callback function, it may be changeable at runtime.

## Consequences
