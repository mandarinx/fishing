"use strict";

// NOTES
// - To add a more boat-like feel to the movement, a slowdown on stop would
//   be nice. Also a bit of slowness at start.
// - Turning radius should be a factor of speed. Greater radius at greater
//   speeds.
// - Use the angle of the rotation to switch between sprites.
// - boat needs an update routine that knows that kind of tile it is on.
//   Use Phaser tile callbacks? They need to be reset between each
//   map switch.

var config          = require('config');
var input           = require('controllers/input');
var states          = require('controllers/states');
var physics         = require('helpers/phaser/physics');
var player          = require('entities/player');

var speed_rotate = 90;
var speed_forward = 40;
var game;
var boat;
var hull;
var sails;
var sail_up = 1;
var sail_down = 2;
var sail_is_up = false;

var settings = {
    spawn_tile: 'Shallow sea'
};

module.exports.init = function(g) {
    game = g;
    boat = game.add.sprite();

    states.add(this, 'dock', dock);
    states.add(this, 'idle', idle);

    hull = boat.addChild(game.make.sprite(0, 0, 'sprites'));
    hull.anchor.setTo(0.5, 0.5);
    hull.frame = 0;

    sails = boat.addChild(game.make.sprite(0, 0, 'sprites'));
    sails.anchor.setTo(0.5, 1);
    sails.x += 1;
    setSail();

    // Get these values from somewhere. They are the half of the sprite's
    // dimensions
    // x += 8;
    // y += 8;
    // boat.x = x;
    // boat.y = y;
    boat.anchor.setTo(0.5, 0.5);

    physics.enable(boat);
    physics.enable(hull);

    boat.body.setSize(12, 12, 0, 0);

    this.hide();

    return this;
};

module.exports.update = function() {
    if (!boat.visible) {
        return;
    }

    states.current(this);

    boat.body.velocity.x *= 0.9;
    boat.body.velocity.y *= 0.9;
    hull.body.angularVelocity *= 0.9;

    sail_is_up = input.up ? true : false;
    setSail();

    if (sail_is_up) {
        game.physics.arcade.accelerationFromRotation(hull.rotation,
                                                     speed_forward,
                                                     boat.body.velocity);
    }

    if (input.right) {
        hull.body.angularVelocity = speed_rotate;
    } else if (input.left) {
        hull.body.angularVelocity = -speed_rotate;
    }
};

module.exports.show = function(x, y) {
    // TODO: get the tile's halfsize from somewhere
    boat.x = x + 8;
    boat.y = y + 8;
    boat.visible = true;
    states.set(this, 'sailing');
}

module.exports.hide = function() {
    boat.visible = false;
    states.set(this, 'idle');
}

function setSail() {
    sails.frame = sail_is_up ? sail_up : sail_down;
}

function idle() {}

function dock(pier) {
    if (input.action) {
        player.switchTo('fisherman', pier.position.x, pier.position.y);
    }
}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return boat; },
    enumerable: true
});

Object.defineProperty(module.exports, 'settings', {
    get: function() { return settings; },
    enumerable: true
});
