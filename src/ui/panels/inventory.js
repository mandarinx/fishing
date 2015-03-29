"use strict";

// TODO: Should find a way for panels to extend some other object so that
// ui manager can be sure to find the most important functions on each
// panel.
// show, hide, visible

var plane       = require('ui/components/plane');
var image       = require('ui/components/image');
var type        = require('utils/type');
var config      = require('config');

var visible;
var dim = {};
var items = [];
var game;
var game_cfg;

// TODO: Move to config.json
var settings = {
    columns:    8,
    rows:       4,
    spacing:    4,
    padding:    8,
    slot_size:  16
};

var inventory_panel = {
    init: function(g) {
        game = g;
        game_cfg = config.get('game');

        dim = getDimensions();

        plane.create(game,
                    (game_cfg.width - dim.width) / 2,
                    (game_cfg.height - dim.height) / 2,
                    dim.width, dim.height,
                    0xaa8e54);

        for (var i=0; i<(settings.columns * settings.rows); i++) {
            items.push(image.create(game));
        }

        this.hide();
    },

    show: function(slots) {
        items.forEach(function(item, i) {
            item.setSlot(slots[i], getCoordinate(i));
        });

        plane.show();
        visible = true;
    },

    hide: function() {
        items.forEach(function(item, i) {
            item.hide();
        });

        plane.hide();
        visible = false;
    }
};

function getDimensions() {
    var slot_dim = settings.slot_size + (settings.spacing * 2);
    var padding = settings.padding * 2;

    return {
        width:  (slot_dim * settings.columns) + padding,
        height: (slot_dim * settings.rows) + padding
    }
}

function getCoordinate(i) {
    var col = i % settings.columns;
    var row = Math.floor(i / settings.columns);

    return {
        x: ((game_cfg.width - dim.width) / 2) + settings.padding + ((settings.spacing + settings.slot_size) * col),
        y: ((game_cfg.height - dim.height) / 2) + settings.padding + ((settings.spacing + settings.slot_size) * row)
    };
}

Object.defineProperty(inventory_panel, 'visible', {
    get: function() { return visible; },
    enumerable: true
});

module.exports = inventory_panel;
