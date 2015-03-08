"use strict";

var cu              = require('config_utils');
var config          = require('config');
var states          = require('controllers/states');
var level           = require('controllers/level');
var input           = require('controllers/input');
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

    collision_cfg = config.get('level', 'collisions');

    players['fisherman'] = fisherman.init(game, options.layer);
    players['boat'] = boat.init(game, options.layer);

    this.switchTo('boat');
    current.show(options.tile_width * options.spawn_pos.x,
                 options.tile_height * options.spawn_pos.y);

    // TODO: physics shouldn't be dependent on player.
    physics.setPlayer(this);
    update.register(this);

    input.action.onUp.add(onAction);
}

module.exports.update = function() {
    current.update();
}

module.exports.switchTo = function(target, hide) {
    if (type(hide).is_undefined) {
        hide = true;
    }
    if (current && hide) {
        current.hide();
    }
    current = players[target];
    level.setCollision(collision_cfg[target]);
    events.onPlayerChange.dispatch(target);
}

module.exports.triggerEnter = function(entity) {
    // TODO: obsolete
    states.set(current, entity.actions, entity);
}

module.exports.triggerLeave = function(entity) {
    // TODO: obsolete
    states.set(current, 'idle');
}

function onAction() {
    if (physics.triggers.pier.active) {
        current.onPier(physics.triggers.pier.owner);
    }
}

Object.defineProperty(module.exports, 'current', {
    get: function() { return current; },
    enumerable: true
});

