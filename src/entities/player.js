"use strict";

// NOTE:
// Rename player to fisher, and put fisher inside a wrapper module
// that wraps both fisher and boat. Expose functions for
// - updating
// - switching between fisher and boat?
// - access to sprites for debugging

// About switching
// Player could switch automatically when ...
// a) the boat has been pressed against the pier for a certain amount of time
// b) the boat is close to the pier, and player is pressing a key
//    This should be fairly easy to make. Add a trigger to the pier, and make
//    it fairly large.
//    Create a physics manager that exposes functions for adding colliders
//    and triggers. Triggers use game.physics.overlap.
//    Callbacks for triggers and collisions are kept in a list. All callbacks
//    are called for every collision and overlap.

var config = require('config');
var player;
var game;
var player_cfg;

module.exports.create = function(g, x, y) {
    game = g;
    player_cfg = config.get('entities', 'player');

    player = game.add.sprite(x, y, 'sprites');
    player.anchor.setTo(0.5, 0);
    player.frame = 3;

    var physics_system = config.get('game', 'physics_system');
    game.physics.enable(player, Phaser.Physics[physics_system]);

    player.body.setSize(12, 12, 0, 0);
};

module.exports.update = function(cursors, pointer, layer) {
    game.physics.arcade.collide(player, layer);

    if (cursors.up.isDown) {
        player.y -= player_cfg.speed;
    } else if (cursors.down.isDown) {
        player.y += player_cfg.speed;
    }

    if (cursors.left.isDown) {
        player.x -= player_cfg.speed;
    } else if (cursors.right.isDown) {
        player.x += player_cfg.speed;
    }
};

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return player; },
    enumerable: true
});
