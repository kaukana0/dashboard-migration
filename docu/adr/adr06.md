# 6. Text above select

Date: 2023-06

## Status

Accepted

## Context

for geo- and by-selects, above the box, right aligned should be a changeable text, saying "x seletable", where x depends on what the user selected in both geo- and by-selects.

alternatives:

1. wrap existing webcomponent in new one and add functionality
2. new webcomponent, but derive class from existing WC and add functionality
3. impl' functionality not in a webcomponent, but in the application

## Decision

1. no, because need to forward the whole API
2. no, because I don't know how to extend a class in JS (Lol)
3. no, because it messes up the code (by being all over the place instead of in one place)

1. and 2.: is that functionality even general enough to warrant putting it into the component and in turn, making that even more complicated?
-> no.

so 3. because least of all evil:

  - put markup for DOM elements into getDocFrag for both
    - don't forget CSS for the blue circle
  - events: cards::addBoxEventHandlers if geo or by, onSelected()
    - but it sucks that geo is somewhere else, in ui::createUIElements
      - in general it sucks that geo is such a princess! can't it also go through addBoxEventHandlers(), like any other box?
        - no, because it's not in a card and thus it doesn't make sense to treat it in cards.mjs::create()
  - access DOM elements: via getElementById
  - calculation in commonConstraints, because it's already there to handle both boxes (yet for another purpose)

## Consequences

Already mentioned above.
