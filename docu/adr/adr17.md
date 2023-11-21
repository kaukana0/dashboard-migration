# 17. Implementation of responsive behaviour

Date: 2023-11

## Status

WIP

## Context


### Location of code

- CSS for changing size, removing/adding, changing position, changing appearence.
- JS listener for "manually" changing size of the billboard.js svg

Putting the latter into ChartCard or putting it into View?

### area of expanded card

Atm it's position:fixed because it needs to be
- positioned precisely underneath the menu
- on top of other cards

What we need:
- positioned precisely underneath the menu
- on top of other cards
- increasing height as elements start to move underneath each other

#### Alternative approach

An alternative would be, to have a dedicated "screen" (div) which is shown as expanded view and leave all cards untouched.
That screen would have to be fed data from the to-be-expanded card.

### concept of printing what's on the screen

Disable download button on mobile because it's not possible to have all Infos on screen.


## Decision

When expanding, 
- positioning of card absolute, 
- layout of elements wrappable (ie flex),
- chart resize handeled by ChartCard itself (not from outside, i.e. View.mjs), 
- hide/show rows (according to what's visible in expanded vs contracted)
- when neccessary move elements to different location in DOM (just like the country-Select)

## Consequences

