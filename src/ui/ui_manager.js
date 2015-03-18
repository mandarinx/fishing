"use strict";

// module.exports = new Phaser.Group();

// TODO: UI manager should have a very high z index in order to be rendered
// on top of everything else. The manager must therefore be an object
// that gets a z index (a sprite?), and the state needs to run sort() on world.

// UI manager should manage ui panels. A panel is a self contained set of
// components that is attached to a game state. It has properties and functions
// for transitioning in and out, hooking up to the update loop and other events
// by itself. Panels should transition in an out when state changes.

// Inventory panel should lay out ui buttons in a predefined grid. When
// inventory shows the inventory panel, it will simply iterate all the
// buttons, pick the sprite from the inventory slots, and any other
// meta data. All other buttons are reset.

var panel_index     = require('ui/panels/index');

// TODO: put in a panel
var label           = require('ui/components/label');
var input           = require('controllers/input');

// TODO: put in a panel
var action_label;

var panels;

var ui_manager = {
    init: function(game) {

        panels = game.add.group();

        Object.keys(panel_index).forEach(function(panel) {
            panel_index[panel].init(game, panels);
        });

        // var image = game.cache.getImage('label');
        // log(image);

        // action_label = nine_slice_scale.create(game, 'label', {
        //     top: 0, bottom: 22, left: 28, right: 28
        // });

        action_label = label.create(game, 16, 16);
    },

    toggle: function(panel_name, options) {
        // look up panel
        panels.forEach(function(child) {
            console.log(child);
        });
        // if it's visible, hide it
        // if it's hidden, show it, pass options
    }
};

module.exports = ui_manager;

// Replace this with an event system. The events will need to be picked up
// by the various panels and components
module.exports.dispatch = function(name, payload) {
    if (typeof payload === 'undefined') {
        action_label.visible = false;
        return;
    }

    action_label.visible = true;

    if (name === 'action_label') {
        action_label.text = payload + ' [' + input.keys('action').keyCode + ']';
    }
};

// Object.defineProperty(module.exports, 'action_label', {
//     get: function() { return action_label; }
// });
