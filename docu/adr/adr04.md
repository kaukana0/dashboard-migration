# 4. Main menu

Date: 2023-04

## Status

Accepted.

## Context

We need a main menu that looks and behaves like the one in ECL.

alternatives:

1. implement from scratch
2. use vanilla ECL
3. wrap ECL in webComponent

## Decision

3, because 1 is too much work (when narrow it becomes a hamburger menu w/ totally different usability) and 2 is messing up the code.

## Consequences

In retrospect: the menu doesn't lend itself to be used in an SPA - i.e. is not changeable during runtime. This means that implementing highlighting selected items is of not exactly justifiable effort.