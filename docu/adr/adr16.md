# 16. Responsive behaviour

Date: 2023-11

## Status

WIP

## Context

The look and feel of the page has to adapt to narrow screens on mobile devices.
This also applies to changing the window size on desktop computers at runtime while the page is displayed.

For this to happen, the following actions on elements are available:
changing size, removing/adding, changing position, changing appearence.

In general, the responsive behaviour of the already existing "global dashboard" is imitated where applicable.

## Decision

Following a description of actions that happen to elements when resizing.

    Header:

    1) Font-size decreasing
    2) Estat-Logo size decreasing
    3) yellow/blue ribbon disappearing

    Menu:

    Becoming Hamburger-Menu
    Following icons in the menu line:  Back ----------- info, share, hamburger

    Cards:

    Wrapping, meaning they move to the next line one by one - very much like an automatic line-break for text (i.e. "flex-wrap: wrap;")

    Expanded Card:

    1) Chart-size adapting to available width and height
    2) Select boxes (2 to 5 in count) wrapping
    3) Close button disappering, a link named "Back" appearing top left
    4) Download and Article Buttons move below footnote
    5) Title and Subtitle text is wrapping (creating a new line) and fontsize is decreasing.
    6) Info and chart-type buttons move above the title

    Footer:

    Download button is being removed on narrow screen

At which sizes these changes happen is similar to the globalization dashboard and to ELC (ie menu, 995px).

## Consequences
... TODO