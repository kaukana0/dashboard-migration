# 14. Async issues

Date: 2023-08-28

## Status

Implemented and under surveillance

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

One menu selection can lead to 3 distinct chartInstance.resize() calls.

The way the resize is implemented in cartCard is misleading.

It suggests a fire-and-forget, when - in fact - the way it's implemented behind (by card.mjs webComponent) is that the only one wins, others get lost.

There are 3 paths to the resize functionality - as depicted below

    onMenuSelected 1--> filter --> setVisible -->                                --> setData --> resize --> whatever
                   2--> contract --> onCardContract --> onSelectedForAllCards --/           /
                   3--> expand -->                                                    -----/

The "whatever" is: moving the country-box in and out of a card, scrollbars and more.

- 1 is because setVisible caches data if card is not visible and when swichting visible, "catches up" by setting the data.
- 2 calls onSelectedForAllCards because in another flow the user might have changed favourite, affecting all cards.
- 3 this is the desired effect


### Ideas to approach a fix

Idea 1)
introduce a fifo msg queue for resize in chart.mjs.

-> Doesn't solve the bugs

Idea 2)
introduce Promises and setData only if all setVisible are finished.

-> more bugs! also very complicated to introduce promises now.

  - sometimes: no country select and no scrollbar in overview; 
  - sometimes: dot plot doesn't redraw; 
  - once: tooltip in overview wrong (grouped by country) + show second country w/ black lines - only in Edge; 
  - once: lost legend
  - sometimes: empty card spots (beginning and end)
  - always: dotplot after expanding (possibly via menu) & timerange is not being reset

Idea 3)
- avoid 1 by setting data on all cards initially (ditch the "catchUp" mechanism)
- avoid 2 by introducing onSelectedForAllCards(exceptThisOne) or similar
  - wouldn't work, because the card itself has to have setData called to set favorite

-> partially discarded

Idea 4)
- Make async things synchroneous.
- while(flag===undefined) {} and setting flag=true when callback comes back/promise resolves

-> works w/ minimal example code only. Doesn't work in the real context (ChartCard::setData()) for reasons not 100% proven, but most likely just due to how JS works

## Decision

- 1st point of idea 3, because initially, all cards are visible and get data set anyway. no need for a catch-up mechanism.
- ~~setData compares (deep-equal comparison) data-to-be-set w/ current data and doesn't do async things if equal~~
  - turns out to not be neccessary
- introduce callback for setData to attempt to serialize at least some flows
- ~~introduce detection mechanism for concurrent resize() calls (in order to potentially do sth about it in case bugs appear again)~~
  - attempted in chart, failed to remedy issues

## Consequences

Reliability has to be empirically confirmed (i.e. tests) for changes of the configuration (especially big ones that affect how many cards are shown in the overview) and for changes to the caching strategy.
These tests have to be done for slow internet-connections and on mobile devices (different CPU power).

This is true for as long as the root problem is not adressed - i.e. re-write the functionality of fetching data and filling UI elements to be purely event driven - possibly alternatively an appropriate locking mechanism.

### addendum

After a few months in production, there are no reported issues regarding this topic (commitId 3c6b9c1).
