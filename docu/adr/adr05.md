# 5. Select boxes

Date: 2023-04

## Status

Accepted

## Context

There needs to be a select box with certain features not available outside of globalisation dashboard.
That selectbox ideally should be re-useable in as many as feasible circumstances.

There are 3 approaches analyzed:

1. Modify original ECL select
2. Make WebComponent out of globdash code
3. Modify already existing select WebComponent
4. implement from scratch

### adv/disadv. of 3 different approaches

In the following discussion, the "+" means advantage for the apprach, "-" disadvantage.

    Modify original ECL select

    + 100% ECL style
    + blue circle
    + integrates w/ ECL (potential benefit in future, irrelevant for now)
    + multiselect
    + comma separated list of selections
    + already ICPT compatible (most important features, not fully)
    - check if build from src works
    - assess source-mod effort: 
      - no search, selectall, clear, close
      - fav star
      - selectionAllowed callback
      - group check-all checkbox
    - source mod has to be mainained as well (repo & versioning etc.)
    - single select doesn't look like globdash (or other dashboards)

    Make WebComponent out of globdash code

    + blue circle
    + multiselect and singleselect
    + fav star (for multiselect)
    - assess effort: 
      - fav star also for single select (where we need it)
      - selectionAllowed callback
      - group check-all checkbox
      - making IPCT compatible webComponent out of it (impl. the API)
        - replace jquery w/ vanillaJS
      - comma separated list of selections (currently just "countries selected")
      - not 100% ECL style (looks somewhat "off")

    Modify already existing select WebComponent from IPCT

    + API already stands, skeleton/framework already exists, no start from 0
    + ICPT compatible
    + better integrateable in older app versions (ie food price monitoring).
    - multiselect looks different (checkbox)
    - to be implemented:
      - fav star
      - blue circle
      - comma separated list of selections
      - ECL looks (no mini images, arrow)
      - selectionAllowed callback
      - group check-all checkbox

    from scratch

    - infeasible


## Decision

Modify already existing select WebComponent

## Consequences
