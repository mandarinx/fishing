"use strict";

var physics         = require('helpers/phaser/physics');
var ui              = require('ui/ui_manager');
var extend          = require('utils/extend');
var entity          = require('entities/entity');
var player          = require('entities/player');

var bounds;
var position;

var action_labels = {
    boat:       'dock',
    fisherman:  'board'
};

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
    player.current.action.add(onAction);
    ui.dispatch('action_label', action_labels[player.current.sprite.name]);
}

module.exports.triggerLeave = function(player) {
    player.current.action.remove(onAction);
    ui.dispatch('action_label');
}

function onAction() {
    // Blah!
    if (player.current.sprite.name === 'boat') {
        player.toggle(position.x, position.y);
    } else {
        player.toggle();
    }
    ui.dispatch('action_label', action_labels[player.current.sprite.name]);
}

Object.defineProperty(module.exports, 'bounds', {
    get: function() { return bounds; },
    enumerable: true
});

Object.defineProperty(module.exports, 'position', {
    get: function() { return position; },
    enumerable: true
});
