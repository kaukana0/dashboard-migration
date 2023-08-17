# 11. Various Breakdowns

Date: 2023-07

## Status

WIP

## Context

A "breakdown" is how a dataset is organized to make sense in the business domain.
In this case this means the following.
Most of the indicators' datasets (and cards) have 6 options to select in the "by Citizenship / by Birth" selectBox - 3 * byCitizen and 3 * byBirth.
Associated w/ each of those 6 options is a certain dimension and certain codes of that dimension.

A new requirement came up to support breakdowns that deviate from this "standard" one.

E.g. where there are only 3 * byBirth options available, or only 1 option at all - the latter making the selectbox actually superfluous. Or even that the dimension name is different and the code as well.

Modifying this already implemented funtionality concerns the configuration yaml, selecbox creation, constraint logic and data retrieval (fragment building).

The current implementatin assumes certain aspects, meaning they're hardcoded.
Now these aspects have to either:

a) be modified for particular exceptions
b) or be made more flexible

## Decision

### "originalCode"

The yaml and the current implementation supports already a mapping to differentiate between:
"native born" OR "nationals" -> NAT
"born in another EU" OR "citizens of another EU" -> EU27_2020_FOR
"NON eu born" OR "non EU citizen" -> NEU27_2020_FOR

In the yaml it's specified via the "originalCode" property - we actually introduce a "made-up" codes for each selectBox entry and use the "originalCode" instead of the made-up one. This is because keys in a map are unique - and the items of a selectbox are a map.

This is a hardcoded speciality only for the "by-select"-box and it's because 1 dataset for birth has the same codes than another dataset for citizenship and we put both into the selecbox.

### selectbox group header

this works already as expected.

### 


## Consequences
