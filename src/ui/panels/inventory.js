"use strict";

var image = require('ui/components/image');

var panel;

var inventory_panel = {
    init: function(game, parent_group) {
        panel = game.add.group(parent_group, 'inventory');

        // TODO: Image component draws a square using game.graphics, but will
        // later be replaced with loading an image from cache, or somewhere.
        var panel_width = 192;
        var panel_height = 96;
        var bg = image.create(game,
                              (512 - panel_width) / 2,
                              (512 - panel_height) / 2,
                              panel_width,
                              panel_height,
                              0xaa8e54);
        panel.add(bg);

        // add slots using ui component
            // lay them out in a grid
        // add local group to parent_group
    }
};

module.exports = inventory_panel;
