"use strict";

var physics         = require('helpers/phaser/physics');
var ui              = require('ui/ui_manager');

var bounds;

module.exports.create = function(layer, map_data) {
    var tw = layer.map.tileWidth;
    var th = layer.map.tileHeight;
    var x = (tw * map_data.meta.pier_pos.x) - tw;
    var y = (th * map_data.meta.pier_pos.y) - th;

    bounds = new Phaser.Rectangle(x, y, tw * 3, th * 3);
    physics.addTrigger(this);
}

module.exports.triggerEnter = function(player) {
    ui.dispatch('action_label', 'Dock');
}

module.exports.triggerLeave = function(player) {
    ui.dispatch('action_label');
}

// Should be part of a decorator
module.exports.triggerStay = function(player) {}

Object.defineProperty(module.exports, 'bounds', {
    get: function() { return bounds; },
    enumerable: true
});
