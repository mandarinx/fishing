"use strict";

var config          = require('config');
var input           = require('controllers/input');
var states          = require('controllers/states');
var physics         = require('helpers/phaser/physics');
var player          = require('entities/player');
var type            = require('utils/type');

var fisherman;
var game;
var player_cfg;
var layer;

module.exports.init = function(g, l) {
    game = g;
    layer = l;

    player_cfg = config.get('entities', 'player');

    // TODO: obsolete
    states.add(this, 'idle', idle);

    fisherman = game.add.sprite(0, 0, 'sprites');
    fisherman.anchor.setTo(0.5, 0);
    fisherman.frame = 3;
    fisherman.name = 'fisherman';

    physics.enable(fisherman);
    fisherman.body.setSize(12, 12, 0, 4);

    this.hide();

    return this;
};

module.exports.update = function() {
    physics.collide(fisherman, layer);
    states.current(this);

    fisherman.body.velocity.x *= 0.2;
    fisherman.body.velocity.y *= 0.2;

    if (input.up.isDown) {
        fisherman.body.velocity.y = -player_cfg.speed;
    } else if (input.down.isDown) {
        fisherman.body.velocity.y = player_cfg.speed;
    }

    if (input.left.isDown) {
        fisherman.body.velocity.x = -player_cfg.speed;
    } else if (input.right.isDown) {
        fisherman.body.velocity.x = player_cfg.speed;
    }
};

module.exports.show = function(x, y) {
    if (type(x).is_undefined) {
        x = fisherman.x;
    } else {
        x = x + 8;
    }

    if (type(y).is_undefined) {
        y = fisherman.y;
    }

    fisherman.x = x;
    fisherman.y = y;
    fisherman.visible = true;
    states.set(this, 'walking');
}

module.exports.hide = function() {
    fisherman.visible = false;
    states.set(this, 'idle');
}

module.exports.onPier = function(pier) {
    fisherman.body.velocity.setTo(0, 0);
    player.switchTo('boat', true);
    player.current.show();
}

// TODO: obsolete
function idle() {}
function board() {}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return fisherman; },
    enumerable: true
});

Object.defineProperty(module.exports, 'settings', {
    get: function() { return settings; },
    enumerable: true
});
