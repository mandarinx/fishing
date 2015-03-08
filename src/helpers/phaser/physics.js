"use strict";

var config          = require('config');
var update          = require('helpers/phaser/update');

var triggers = {};
var player;
var system_type;
var system;
var game;

module.exports.init = function(g) {
    game = g;
    var system_id = config.get('game', 'physics_system');
    system_type = Phaser.Physics[system_id];
    game.physics.startSystem(system_type);
    system = game.physics[system_id.toLowerCase()];
    update.register(this);
}

// Public accessor for triggers
module.exports.triggers = {};

module.exports.enable = function(sprite) {
    game.physics.enable(sprite, system_type);
}

module.exports.collide = function(a, b) {
    system.collide(a, b);
}

// Terrible! Why must the physics system depend on player?
module.exports.setPlayer = function(p) {
    player = p;
}

module.exports.addTrigger = function(owner, name) {
    triggers[name] = {
        owner:      owner,
        active:     false
    };

    Object.defineProperty(module.exports.triggers, name, {
        get: function() { return triggers[name]; }
    });
}

module.exports.update = function() {
    var trigger;
    Object.keys(triggers).forEach(function(name) {
        trigger = triggers[name];
        if (Phaser.Rectangle.intersects(player.current.sprite.getBounds(),
                                        trigger.owner.bounds)) {
            if (!trigger.active) {
                trigger.owner.triggerEnter(player);
                player.triggerEnter(trigger.owner);
                trigger.active = true;
            }
            trigger.owner.triggerStay(player);
            player.triggerStay(trigger.owner);

        } else {
            if (trigger.active) {
                trigger.owner.triggerLeave(player);
                player.triggerLeave(trigger.owner);
                trigger.active = false;
            }
        }
    });
}
