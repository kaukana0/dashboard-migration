# 1. Overall Approach

Date: 2023-01

## Status

Accepted.

## Context

Assuming the requirements are sufficiently specified and don't change significantly after start of implementation, how is this best implemented?

There are a couple of obvious choices:

1. since it's supposed to be similar to the already existing green-deal dashboard, copy that code and modify it to fit the additional/different requirements
2. use euro-indicators dashboard as a basis, copy and modify as mentioned above
3. "rework" as WebComponents
4. implement from scratch w/ usual tech-stack
5. use a framework
6. implement from scratch as WebComponents using already existing WebComponents

## Decision

6, because 
- code of 1 is too opaque and modifications would be significant,
- existing codebase doesn't contain readily extractable re-usable parts (modules, classes, etc.),
- 2 requires proficiency with svelte,
- there is no consensus about a tech-stack (inc. framework) when impl. dashboards
- WebComponents can be considered the "Lowest common denominator" for modularizing functionality - they can potentially readily be used in any major framework

## Consequences

- some already existing WebComponents have to be functionally enhanced (e.g. dropdownBox)
