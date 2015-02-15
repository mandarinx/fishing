"use strict";

var config          = require('config');
var update          = require('helpers/phaser/update');

var overlaps = [];
var player_bounds;
var player;

module.exports.init = function(game) {
    var physics_system = config.get('game', 'physics_system');
    game.physics.startSystem(Phaser.Physics[physics_system]);
    update.register(this);
}

// enableForSprite(sprite)
    // enable physics for the given sprite, using the defined physics system

// all sprites collide with player by default

// addTrigger(sprite, options, callback)
    // add physics to sprite if not added
    // scale up the hit area using options
    // add sprite and callback to an object in a list of triggers

module.exports.setPlayer = function(p) {
    player = p;
}

module.exports.addOverlap = function(bounds, callback) {
    overlaps.push({bounds: bounds, callback: callback});
}

module.exports.update = function() {
    player_bounds = player.sprite.getBounds();

    overlaps.forEach(function(overlap) {
        if (Phaser.Rectangle.intersects(player_bounds, overlap.bounds)) {
            overlap.callback(player);
        }
    });
}
