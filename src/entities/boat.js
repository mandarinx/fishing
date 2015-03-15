"use strict";

// NOTES
// - Turning radius should be a factor of speed. Greater radius at greater
//   speeds.
// - Use the angle of the rotation to switch between sprites.

var config          = require('config');
var input           = require('controllers/input');
var physics         = require('helpers/phaser/physics');
var player          = require('entities/player');
var fishingrod      = require('entities/fishingrod');
var sail            = require('entities/sail');
var type            = require('utils/type');
var action          = require('controllers/action');

var game;
var boat;
var hull;
var sails;
var layer;
var player_cfg;

module.exports.action = action.create();

module.exports.init = function(g, l) {
    game = g;
    layer = l;
    player_cfg = config.get('entities', 'player');

    this.action.add(onAction);

    boat = game.add.sprite();
    boat.anchor.setTo(0.5, 0.5);
    boat.name = 'boat';

    hull = boat.addChild(game.make.sprite(0, 0, 'sprites-16'));
    hull.anchor.setTo(0.5, 0.5);
    hull.frame = 0;
    hull.name = 'hull';

    sails = sail.init(game, boat);
    fishingrod.init(game, boat);

    physics.enable(boat);
    physics.enable(hull);

    boat.body.setSize(12, 12, 0, 0);

    this.hide();

    return this;
};

module.exports.update = function() {
    physics.collide(boat, layer);

    boat.body.velocity.x *= 0.9;
    boat.body.velocity.y *= 0.9;
    hull.body.angularVelocity *= 0.9;

    if (sails.raised(input.up.isDown)) {
        game.physics.arcade.accelerationFromRotation(hull.rotation,
                                                     player_cfg.sailing_speed,
                                                     boat.body.velocity);
    }

    if (input.right.isDown) {
        hull.body.angularVelocity = player_cfg.sailing_rotate_speed;
    } else if (input.left.isDown) {
        hull.body.angularVelocity = -player_cfg.sailing_rotate_speed;
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
}

module.exports.hide = function() {
    boat.body.velocity.setTo(0, 0);
}

function onAction() {
    fishingrod.toggle();
}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return boat; },
    enumerable: true
});
