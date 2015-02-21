"use strict";

var physics         = require('helpers/phaser/physics');
var ui              = require('ui/ui_manager');
var extend          = require('utils/extend');
var entity          = require('entities/entity');

var bounds;
var position;
var actions = ['dock'];

extend(module.exports, entity);

module.exports.create = function(layer, map_data) {
    var tw = layer.map.tileWidth;
    var th = layer.map.tileHeight;
    var x = (tw * map_data.meta.pier_pos.x) - tw;
    var y = (th * map_data.meta.pier_pos.y) - th;

    position = {
        x: map_data.meta.pier_pos.x * tw,
        y: map_data.meta.pier_pos.y * th
    };
    bounds = new Phaser.Rectangle(x, y, tw * 3, th * 3);
    physics.addTrigger(this);
}

module.exports.triggerEnter = function(player) {
    ui.dispatch('action_label', 'Dock');
}

module.exports.triggerLeave = function(player) {
    ui.dispatch('action_label');
}

Object.defineProperty(module.exports, 'bounds', {
    get: function() { return bounds; },
    enumerable: true
});

Object.defineProperty(module.exports, 'position', {
    get: function() { return position; },
    enumerable: true
});

Object.defineProperty(module.exports, 'actions', {
    get: function() { return actions; },
    enumerable: true
});
