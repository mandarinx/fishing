"use strict";

// TODO: Should find a way for panels to extend some other object so that
// ui manager can be sure to find the most important functions on each
// panel.
// show, hide, visible

var image = require('ui/components/image');

var visible;

var inventory_panel = {
    init: function(game) {
        // TODO: Image component draws a square using game.graphics, but will
        // later be replaced with loading an image from cache, or somewhere.
        var panel_width = 192;
        var panel_height = 96;
        image.create(game,
                    (512 - panel_width) / 2,
                    (512 - panel_height) / 2,
                    panel_width,
                    panel_height,
                    0xaa8e54);

        // add slots using ui component
            // lay them out in a grid

        this.hide();
    },

    show: function(options) {
        image.show();
        visible = true;
    },

    hide: function() {
        image.hide();
        visible = false;
    }
};

Object.defineProperty(inventory_panel, 'visible', {
    get: function() { return visible; },
    enumerable: true
});

module.exports = inventory_panel;
