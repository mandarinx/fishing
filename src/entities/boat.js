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
var physics         = require('helpers/phaser/physics');

var speed_rotate = 90;
var speed_forward = 40;
var game;
var boat;
var hull;
var sails;
var sail_up = 1;
var sail_down = 2;
var sail_is_up = false;
// var key_space;

module.exports.create = function(g, x, y) {
    game = g;
    boat = game.add.sprite();

    hull = boat.addChild(game.make.sprite(0, 0, 'sprites'));
    hull.anchor.setTo(0.5, 0.5);
    hull.frame = 0;

    sails = boat.addChild(game.make.sprite(0, 0, 'sprites'));
    sails.anchor.setTo(0.5, 1);
    sails.x += 1;
    setSail();

    // Get these values from somewhere. They are the half of the sprite's
    // dimensions
    x += 8;
    y += 8;
    boat.x = x;
    boat.y = y;
    boat.anchor.setTo(0.5, 0.5);

    var physics_system = config.get('game', 'physics_system');
    game.physics.enable(boat, Phaser.Physics[physics_system]);
    game.physics.enable(hull, Phaser.Physics[physics_system]);

    boat.body.setSize(12, 12, 0, 0);

    physics.setPlayer(this);
    // Keep for action button, like fishing
    // key_space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // key_space.onUp.add(onSpace);
};

module.exports.update = function(cursors, pointer, layer) {
    game.physics.arcade.collide(boat, layer);

    boat.body.velocity.x *= 0.9;
    boat.body.velocity.y *= 0.9;
    hull.body.angularVelocity *= 0.9;

    sail_is_up = cursors.up.isDown ? true : false;
    setSail();

    if (sail_is_up) {
        game.physics.arcade.accelerationFromRotation(hull.rotation,
                                                     speed_forward,
                                                     boat.body.velocity);
    }

    if (cursors.right.isDown) {
        hull.body.angularVelocity = speed_rotate;
    } else if (cursors.left.isDown) {
        hull.body.angularVelocity = -speed_rotate;
    }
};

function setSail() {
    sails.frame = sail_is_up ? sail_up : sail_down;
}

// function onSpace() {
// }

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return boat; },
    enumerable: true
});
