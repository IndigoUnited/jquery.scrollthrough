(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
} (this, function ($) {

    'use strict';

    var canUseMouseEvent = /\bAppleWebKit/i.test(navigator.userAgent) && document.dispatchEvent;

    function ScrollThrough(element, scrollElement, options) {
        this._element = $(element);
        this._scrollElement = $(scrollElement);
        this._nativeScrollElement = this._scrollElement[0];

        this._options = $.extend({
            delay: 100,
            ignore: null
        }, options);

        // Binds
        this._onWheelMouseEvent = this._onWheelMouseEvent.bind(this);
        this._onWheelPointerEvents = this._onWheelPointerEvents.bind(this);
        this._onWheelScrollPointerEvents = this._onWheelScrollPointerEvents.bind(this);

        // Destroy event, see: https://github.com/IndigoUnited/jquery.destroy-event
        this._element.on('destroy.scrollthrough', this.destroy.bind(this));

        // Init!
        this.enable();
    }

    ScrollThrough.prototype.enable = function () {
        if (this._enabled) {
            return this;
        }

        // Add events
        if (canUseMouseEvent) {
            this._element[0].addEventListener('wheel', this._onWheelMouseEvent, false);
        } else {
            this._element.on('wheel', this._onWheelPointerEvents);
            this._scrollElement.on('wheel', this._onWheelScrollPointerEvents);
        }

        this._enabled = true;

        return this;
    };

    ScrollThrough.prototype.disable = function () {
        if (!this._enabled) {
            return this;
        }

        // Remove events
        if (canUseMouseEvent) {
            this._element[0].removeEventListener('wheel', this._onWheelMouseEvent, false);
        } else {
            this._element.off('wheel', this._onWheelPointerEvents);
            this._scrollElement.off('wheel', this._onWheelScrollPointerEvents);

            // Cancel timers
            if (this._mouseWheelPointerEventsTimer) {
                clearTimeout(this._mouseWheelPointerEventsTimer);
                this._mouseWheelPointerEventsTimer = null;
            }

            if (this._mouseWheelPointerScrollEventsTimer) {
                clearTimeout(this._mouseWheelPointerScrollEventsTimer);
                this._mouseWheelPointerScrollEventsTimer = null;
            }

            if (this._wheeled) {
                this._element.css('pointer-events', '');
                this._wheeled = false;
            }
        }

        this._enabled = false;

        return this;
    };

    ScrollThrough.prototype.destroy = function () {
        this.disable();

        this._element.off('destroy.scrollthrough');

        this._element.removeData('_scrollthrough');
        this._element = this._scrollElement = this._nativeScrollElement;
    };

    // ------------------------------------

    ScrollThrough.prototype._onWheelMouseEvent = function (e) {
        var myEvt;

        if (this._options.ignore && this._options.ignore(e)) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        myEvt = new e.constructor(e.type, e);
        this._nativeScrollElement.dispatchEvent(myEvt);
    };

    ScrollThrough.prototype._onWheelPointerEvents = function (e) {
        var that = this;

        if (this._options.ignore && this._options.ignore(e)) {
            return;
        }

        if (this._wheeled) {
            return;
        }

        this._wheeled = true;
        that._element.css('pointer-events', 'none');

        // This timer is not really necessary.. it's just here to protect
        // against bad plugin usage..
        this._mouseWheelPointerEventsTimer = setTimeout(function () {
            that._mouseWheelPointerEventsTimer = null;

            if (!that._mouseWheelScrollPointerEventsTimer) {
                that._wheeled = false;
                that._element.css('pointer-events', '');
            }
        }, this._options.delay);
    };

    ScrollThrough.prototype._onWheelScrollPointerEvents = function () {
        var that = this;

        if (!that._wheeled) {
            return;
        }

        if (this._mouseWheelPointerEventsTimer) {
            clearTimeout(this._mouseWheelPointerEventsTimer);
            this._mouseWheelPointerEventsTimer = null;
        }

        this._mouseWheelPointerScrollEventsTimer && clearTimeout(this._mouseWheelPointerScrollEventsTimer);
        this._mouseWheelPointerScrollEventsTimer = setTimeout(function () {
            that._mouseWheelPointerScrollEventsTimer = null;

            that._wheeled = false;
            that._element.css('pointer-events', '');
        }, this._options.delay);
    };


    // ------------------------------------

    $.fn.scrollthrough = function () {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function () {
            var $this = $(this),
                data  = $this.data('_scrollthrough');

            if (typeof args[0] === 'string' && ScrollThrough.prototype[args[0]]) {
                if (!data) {
                    return;
                }

                data[args[0]].apply(data, args.slice(1));
            } else {
                if (data) {
                    throw new Error('Plugin was already initialized');
                }

                $this.data('_scrollthrough', (data = new ScrollThrough(this, args[0], args[1])));
            }
        });
    };

    $.fn.scrollthrough.Constructor = ScrollThrough;

    return $;
}));
