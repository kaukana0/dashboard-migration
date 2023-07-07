# 9. Range slider config

Date: 2023-07

## Status

Accepted

## Context

The start/end/current values for most of the cards the same but we need the possibility to have different values for some cards.
There needs to be a certain "logic" for setting the time range initial values - they depend on config and on data requested by the webservice.

## Decision

The config yaml is the right place for having a default and exceptions to it per card.

As for the logic, there should be the possibility to fix start/end/current and also to have it "rolling" - ie follow the current year.

So, this is the default, setting the initial slider value to currentYear-10:

      range:              # start/end from requested data may override this
        - time:
          start: 2010
          end: 0          # if end is null then current year + current is calculated (current has to be negative)
          current: -10

And this would fix it to a certain range:

      range:
        - time:
          start: 2015
          end: 2022
          current: 2018

- It is made sure that current >=min <=max.
- Also, that max <= current year.
- If the configured range <min or >max of the requested data, those values are corrected - meaning range in real data overrides config.

## Consequences
