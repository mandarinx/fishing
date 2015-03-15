"use strict";

var sprite;
var game;
var sail_up = 1;
var sail_down = 2;
var sail_is_up = false;

module.exports.init = function(g, boat) {
    game = g;

    sprite = boat.addChild(game.make.sprite(0, 0, 'sprites-16'));
    sprite.anchor.setTo(0.5, 1);
    sprite.x += 1;
    sprite.name = 'sails';

    return this;
};

module.exports.raised = function(raise) {
    sprite.frame = raise ? sail_up : sail_down;
    return raise;
};

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return sprite; },
    enumerable: true
});
