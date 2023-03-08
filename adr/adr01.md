# 1. Overall Approach

Date: 2023-01

## Status

Accepted.

## Context

Assuming the requirements are sufficiently specified and don't change significantly after start of implementation, how is this best implemented?

There are a few obvious choices:

1. since it's supposed to be similar to the already existing green-deal dashboard, copy that code and modify it to fit the additional/different requirements
2. use euro-indicators dashboard as a basis, copy and modify as mentioned above
3. "rework" as webComponents
4. implement completely from scratch w/ usual tech-stack
5. use a framework


## Decision

3, because 
- code of 1 is too opaque and modifications would be significant,
- 2 requires proficiency with svelte,
- there is no consensus about a tech-stack when impl. dashboards,

Try to take over as much code and ideas as possible but "rework" fragments into components w/ documented abilities, interface and usage.

- css can partly be re-used from greendeal
- dataload behaviour and config can relatively simple be adapted to suit needs (pipeline component)
- potentially, portions of the existing code can be "extracted" and packaged into re-usable webComponents

## Consequences

- some existing webComponents have to be enhanced (e.g. dropdownBox supporting "favorite" single-select)
