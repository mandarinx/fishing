"use strict";

var config          = require('config');
var update          = require('helpers/phaser/update');

var triggers = [];
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

module.exports.enable = function(sprite) {
    game.physics.enable(sprite, system_type);
}

module.exports.collide = function(a, b) {
    system.collide(a, b);
}

module.exports.setPlayer = function(p) {
    player = p;
}

module.exports.addTrigger = function(owner) {
    triggers.push({
        owner:      owner,
        entered:    false
    });
}

module.exports.update = function() {
    triggers.forEach(function(trigger) {
        if (Phaser.Rectangle.intersects(player.sprite.getBounds(),
                                        trigger.owner.bounds)) {
            if (!trigger.entered) {
                trigger.owner.triggerEnter(player);
                player.triggerEnter(trigger.owner);
                trigger.entered = true;
            }
            trigger.owner.triggerStay(player);
            player.triggerStay(trigger.owner);

        } else {
            if (trigger.entered) {
                trigger.owner.triggerLeave(player);
                player.triggerLeave(trigger.owner);
                trigger.entered = false;
            }
        }
    });
}
