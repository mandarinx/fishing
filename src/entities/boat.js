"use strict";

// NOTES
// - Turning radius should be a factor of speed. Greater radius at greater
//   speeds.
// - Use the angle of the rotation to switch between sprites.

var config          = require('config');
var input           = require('controllers/input');
var states          = require('controllers/states');
var physics         = require('helpers/phaser/physics');
var player          = require('entities/player');
var type            = require('utils/type');

var speed_rotate = 90;
var speed_forward = 40;
var game;
var boat;
var hull;
var sails;
var sail_up = 1;
var sail_down = 2;
var sail_is_up = false;
var layer;

module.exports.init = function(g, l) {
    game = g;
    layer = l;

    boat = game.add.sprite();
    boat.name = 'boat';

    states.add(this, 'dock', dock);
    states.add(this, 'idle', idle);

    hull = boat.addChild(game.make.sprite(0, 0, 'sprites-16'));
    hull.anchor.setTo(0.5, 0.5);
    hull.frame = 0;
    hull.name = 'hull';

    sails = boat.addChild(game.make.sprite(0, 0, 'sprites-16'));
    sails.anchor.setTo(0.5, 1);
    sails.x += 1;
    sails.name = 'sails';

    boat.anchor.setTo(0.5, 0.5);

    physics.enable(boat);
    physics.enable(hull);

    boat.body.setSize(12, 12, 0, 0);

    this.hide();

    return this;
};

module.exports.update = function() {
    physics.collide(boat, layer);
    states.current(this);

    boat.body.velocity.x *= 0.9;
    boat.body.velocity.y *= 0.9;
    hull.body.angularVelocity *= 0.9;

    sail_is_up = input.up.isDown ? true : false;
    sails.frame = sail_is_up ? sail_up : sail_down;

    if (sail_is_up) {
        game.physics.arcade.accelerationFromRotation(hull.rotation,
                                                     speed_forward,
                                                     boat.body.velocity);
    }

    if (input.right.isDown) {
        hull.body.angularVelocity = speed_rotate;
    } else if (input.left.isDown) {
        hull.body.angularVelocity = -speed_rotate;
    }
};

module.exports.show = function(x, y) {
    // TODO: get the tile's halfsize from somewhere
    if (type(x).is_undefined) {
        x = boat.x;
    } else {
        x = x + 8;
    }

    if (type(y).is_undefined) {
        y = boat.y;
    } else {
        y = y + 8;
    }

    boat.x = x;
    boat.y = y;
    boat.visible = true;
    states.set(this, 'sailing');
}

module.exports.hide = function() {
    boat.visible = false;
    states.set(this, 'idle');
}

module.exports.onPier = function(pier) {
    boat.body.velocity.setTo(0, 0);
    player.switchTo('fisherman', false);
    player.current.show(pier.position.x, pier.position.y);
}

// TODO: obsolete
function idle() {}
function dock(pier) {}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return boat; },
    enumerable: true
});

Object.defineProperty(module.exports, 'settings', {
    get: function() { return settings; },
    enumerable: true
});
