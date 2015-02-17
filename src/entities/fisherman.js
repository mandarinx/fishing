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

var config          = require('config');
var physics         = require('helpers/phaser/physics');
var input           = require('controllers/input');

var fisherman;
var game;
var player_cfg;
var settings = {
    spawn_tile: ['Island', 'Pier']
};

var states = {
    'idle':     idle
};
var cur_state;

module.exports.init = function(g, x, y) {
    game = g;
    player_cfg = config.get('entities', 'player');

    fisherman = game.add.sprite(x, y, 'sprites');
    fisherman.anchor.setTo(0.5, 0);
    fisherman.frame = 3;

    physics.enable(fisherman);
    fisherman.body.setSize(12, 12, 0, 0);

    this.setState('idle');
};

module.exports.update = function() {
    if (!fisherman.visible) {
        return;
    }

    cur_state();

    if (input.up.isDown) {
        fisherman.y -= player_cfg.speed;
    } else if (input.down.isDown) {
        fisherman.y += player_cfg.speed;
    }

    if (input.left.isDown) {
        fisherman.x -= player_cfg.speed;
    } else if (input.right.isDown) {
        fisherman.x += player_cfg.speed;
    }
};

module.exports.show = function() {
    fisherman.visible = true;
    this.setState('walking');
}

module.exports.hide = function() {
    fisherman.visible = false;
    this.setState('idle');
}

module.exports.setState = function(state) {
    if (state instanceof Array) {
        for (var i=0; i<state.length; i++) {
            if (typeof states[state[i]] !== 'undefined') {
                cur_state = states[state[i]];
                return;
            }
        }
    }

    if (typeof states[state] !== 'undefined') {
        cur_state = states[state];
    }
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
