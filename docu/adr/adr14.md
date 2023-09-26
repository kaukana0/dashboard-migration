# 14. Concurrency issues

Date: 2023-08-28

## Status

hmm....

## Context

Root problem is, that the app is not written in a entirely event driven fashion.
So there are many issues stemming from not properly sequencing operations.
The core points are the done() and onresized() callbacks of the chart.
The whole app has to be restructured around those functions, which are themselves to be treated as a sequence - first done() then onresized().

Some symptoms:

- 1st click menu "material and social deprivation" -> scrollbar still there (always reproducable)
- "country" select doesn't show up in expanded (not easily reproducable)

### Details

Big problem, many bugs, potential and currently real:

- One menu selection can lead to 3 distinct chartInstance.resize() calls.
- The way the resize is implemented in cartCard is misleading.
    - It suggests a fire-and-forget, when - in fact - the way it's implemented behind (by card.mjs webComponent) is that the only one wins, others get lost.


onSelectMenu 1--> filter --> setVisible -->                                --> setData --> resize --> whatever
             2--> contract --> onCardContract --> onSelectedForAllCards --/           /
             3--> expand -->                                                    -----/

The "whatever" is moving the country-box in and out of a card, scrollbars and more.

1 is because at the beginning, setVisible caches data if card is not visible and when swichting visible for the 1st time, "catches up" by setting the data.
2 calls onSelectedForAllCards because in another flow the user might have changed favourite, affecting all cards.
3 this is the desired effect

## Decision

Idea 1)
introduce a fifo msg queue for resize in chart.mjs.
-> Doesn't solve the bugs

Idea 2)
introduce Promises and setData only if all setVisible are finished.
-> more bugs!
  - sometimes: no country select and no scrollbar in overview; 
  - sometimes: dot plot doesn't redraw; 
  - once: tooltip in overview wrong (grouped by country) + show second country w/ black lines - only in Edge; 
  - once: lost legend
  - sometimes: empty card spots (beginning and end)
  - always: dotplot after expanding (possibly via menu) & timerange is not being reset

Idea 3)
- avoid 1 by setting data on all cards initially (ditch the "catchUp" mechanism)
- avoid 2 by introducing onSelectedForAllCards(exceptThisOne) or similar
-> not tried yet

Idea 4)
- Make async things synchroneous.
- while(flag===undefined) {} and setting flag=true when callback comes back/promise resolves
-> works w/ minimal example code, doesn't work in the real context (ChartCard::setData()) for reasons not 100% proven, but most likely just due to how JS works


## Consequences
