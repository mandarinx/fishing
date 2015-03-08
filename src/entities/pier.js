"use strict";

var physics         = require('helpers/phaser/physics');
var ui              = require('ui/ui_manager');
var extend          = require('utils/extend');
var entity          = require('entities/entity');

var bounds;
var position;
var actions = ['dock', 'board'];

extend(module.exports, entity);

module.exports.create = function(tileWidth, tileHeight, spawn_pos) {
    var x = (tileWidth * spawn_pos.x) - tileWidth;
    var y = (tileHeight * spawn_pos.y) - tileHeight;

    position = {
        x: spawn_pos.x * tileWidth,
        y: spawn_pos.y * tileHeight
    };
    bounds = new Phaser.Rectangle(x, y, tileWidth * 3, tileHeight * 3);
    physics.addTrigger(this, 'pier');
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
