# 11. Handling of "EU" code

Date: 2023-08

## Status

Accepted.

## Context

In as much of the code as possible, we want to use "EU" - and not distinct between the multiple possible EU codes (currently and possibly in the future).
However, in the data, there might be "EU", "EU27_2020" and others - even multiple at once.

Assumption:
In general, there is only one relevant code for EU for the whole app
So it's not neccessary that one card has "EU" and another "EU27_2020".

## Decision

We can't just replace "EU27_2020" with "EU" in the raw data received from the REST endpoint, 
because the data might already contain a "EU". So we could potentially end up with the wrong data.

Solution:
In the pipeline processors, replace the EU code we want to pick with "EU" and use "EU" afterwards throughout the code.

There is also the reverse (e.g. replacing "EU27_2020" w/ "EU") needed, because a processor might not iterate through the data but through some config wich contains "EU" (and then do a look-up in the data).

## Consequences

In configs and most of the code, EU is represented by one code.
The exception is a very limited location in the code.
Namely where the data comes in, a replacing of strings is happening - it could be investigated how much of this code results in accidental complexity.