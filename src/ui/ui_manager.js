"use strict";

// module.exports = new Phaser.Group();

// TODO: UI manager should have a very high z index in order to be rendered
// on top of everything else. The manager must therefore be an object
// that gets a z index (a sprite?), and the state needs to run sort() on world.

// UI manager should manage ui panels. A panel is a self contained set of
// components that is attached to a game state. It has properties and functions
// for transitioning in and out, hooking up to the update loop and other events
// by itself. Panels should transition in an out when state changes.

var label           = require('ui/components/label');

var action_label;

module.exports.init = function(game) {
    var group = game.add.group();
    group.update = this.update;

    // var image = game.cache.getImage('label');
    // log(image);

    // action_label = nine_slice_scale.create(game, 'label', {
    //     top: 0, bottom: 22, left: 28, right: 28
    // });

    action_label = label.create(game, 16, 16);
}

module.exports.update = function() {

    // This is not the way to do it. The label should handle this itself.
    action_label.text = '';
};

Object.defineProperty(module.exports, 'action_label', {
    get: function() { return action_label; }
});
