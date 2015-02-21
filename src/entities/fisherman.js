"use strict";

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

var config          = require('config');
var input           = require('controllers/input');
var states          = require('controllers/states');
var physics         = require('helpers/phaser/physics');

var fisherman;
var game;
var player_cfg;
var settings = {
    spawn_tile: ['Island', 'Pier']
};

module.exports.init = function(g) {
    game = g;
    player_cfg = config.get('entities', 'player');

    states.add(this, 'idle', idle);

    fisherman = game.add.sprite(0, 0, 'sprites');
    fisherman.anchor.setTo(0.5, 0);
    fisherman.frame = 3;

    physics.enable(fisherman);
    fisherman.body.setSize(12, 12, 0, 0);

    this.hide();

    return this;
};

module.exports.update = function() {
    if (!fisherman.visible) {
        return;
    }

    states.current(this);

    if (input.up) {
        fisherman.y -= player_cfg.speed;
    } else if (input.down) {
        fisherman.y += player_cfg.speed;
    }

    if (input.left) {
        fisherman.x -= player_cfg.speed;
    } else if (input.right) {
        fisherman.x += player_cfg.speed;
    }
};

module.exports.show = function(x, y) {
    fisherman.x = x + 8;
    fisherman.y = y;
    fisherman.visible = true;
    states.set(this, 'walking');
}

module.exports.hide = function() {
    fisherman.visible = false;
    states.set(this, 'idle');
}

function idle() {}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return fisherman; },
    enumerable: true
});

Object.defineProperty(module.exports, 'settings', {
    get: function() { return settings; },
    enumerable: true
});
