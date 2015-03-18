# jquery.scrollthrough

Makes scrolling pass-through to elements below.

This library is useful when you have an element that overlaps a scrollable element and you want
mousewheel events to be "forwarded" to the scrollable element.


To accomplish this, the plugin uses two different strategies:

- "Forward" synthetic events with `dispatchEvent` (works in webkit based browsers)
- Use `pointer-events: none` before a scroll and remove it after a certain delay

The first strategy is preferred as it doesn't cause a `recalculate style`.

You can checkout the [demo](http://indigounited.github.io/jquery.scrollthrough/test/demo.html) to see it in action.


## API

### .scrollthrough(scrollElement, [options])

Makes "scroll" events on the element to pass-through, so that scroll events are triggered in `scrollElement` instead.   
Note that the element must be above the `scrollElement` for this plugin to work correctly.

Available options:

`delay`  - The delay in ms used to remove the pointer-events


### .scrollthrough('disable')

Disables the scrollthrough.


### .scrollthrough('enable')

Enables the scrollthrough.


### .scrollthrough('destroy')

Destroy the plugin, releasing all events and clearing timers.


## How to use

Simply include the `jquery.scrollthrough.js` file after jQuery is loaded.   
This plugin also integrates with `AMD` (no shim required) and `CommonJS`.


## Tests

No tests yet :(
