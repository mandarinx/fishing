"use strict";

var cu              = require('config_utils');
var config          = require('config');
var level           = require('controllers/level');
var input           = require('controllers/input');
var inventory       = require('controllers/inventory');
var entity          = require('entities/entity');
var boat            = require('entities/boat');
var fisherman       = require('entities/fisherman');
var events          = require('events');
var physics         = require('helpers/phaser/physics');
var update          = require('helpers/phaser/update');
var list            = require('utils/list');
var extend          = require('utils/extend');
var type            = require('utils/type');

var current;
var players = {};
var game;
var collision_cfg;

extend(module.exports, entity);

module.exports.init = function(g, options) {
    game = g;

    inventory.init(game);
    collision_cfg = config.get('level', 'collisions');

    players['fisherman'] = fisherman.init(game, options.layer);
    players['boat'] = boat.init(game, options.layer);

    this.switchTo('boat');
    current.show(options.tile_width * options.spawn_pos.x,
                 options.tile_height * options.spawn_pos.y);

    physics.setPlayer(this);
    update.register(this);

    input.action.onUp.add(onAction);
}

module.exports.update = function() {
    current.update();
}

module.exports.toggle = function(x, y) {
    this.switchTo(current.sprite.name === players.fisherman.sprite.name ?
                  players.boat.sprite.name :
                  players.fisherman.sprite.name, x, y);
}

module.exports.switchTo = function(player_name, x, y) {
    if (current) {
        current.hide();
    }
    current = players[player_name];
    current.show(x, y);
    level.setCollision(collision_cfg[player_name]);
    events.onPlayerChange.dispatch(player_name);
}

module.exports.triggerEnter = function(entity) {
}

module.exports.triggerLeave = function(entity) {
}

function onAction() {
    current.action.execute();
}

Object.defineProperty(module.exports, 'current', {
    get: function() { return current; },
    enumerable: true
});

