"use strict";

// NOTES:

// - Some types of fishes can get away. Pay attention to the fishinrod and
// hit the action button when you get something. Funny? Engaging? Pointless?
// - Bending of the fishing rod should be a looping animation. Could even
// add some randomness to it. Need to hook up to the update function of sprite.

var segment     = require('generators/segment');
var level       = require('controllers/level');
var loot        = require('controllers/loot');
var factory     = require('controllers/factory');
var type        = require('utils/type');
var list        = require('utils/list');
var cu          = require('config_utils');
var events      = require('events');

var sprite;
var game;
var boat;
var timer;
var cur_loot;

var fishingrod = {
    init: function(g, b) {
        game = g;
        boat = b;

        sprite = game.make.sprite(0, 0, 'sprites-16');
        sprite.frame = 8;
        sprite.anchor.setTo(0, 0.5);

        boat.addChild(sprite);

        this.hide();
    },

    hide: function() {
        sprite.visible = false;
        sprite.frame = 8;
        if (!type(timer).is_undefined) {
            timer.stop(true);
        }
        if (!type(cur_loot).is_undefined) {
            game.add.existing(cur_loot.sprite);
            cur_loot.sprite.x = boat.x + 16;
            cur_loot.sprite.y = boat.y;

            var bounce = game.add.tween(cur_loot.sprite);
            bounce.to({ y: boat.y - 16 }, 700, Phaser.Easing.Cubic.Out);
            bounce.onComplete.add(bounceDone);
            bounce.start();

            events.onLootDrop.dispatch(cur_loot);
        }
    },

    show: function() {
        sprite.visible = true;

        timer = game.time.create(true); // true = auto destroy

        // TODO: Time values can be affected by the effectiveness/level
        // of the fishing rod, bait or any other property of the rod.
        var time = (Math.random() * 2000) + 800;
        timer.add(time, timerDone);
        timer.start();
    },

    toggle: function() {
        if (sprite.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
};

module.exports = fishingrod;

function bounceDone() {
    cur_loot.sprite.kill();
    cur_loot = undefined;
}

function timerDone() {

    // There's a 20% chance of not getting anything. Put in config
    if (Math.random() < 0.2) {
        // NOTE: This is an example of the benefit of using module exports
        // on an object, rather than one module export for each function
        // and property. With this method, private functions can easily
        // access the public functions.
        fishingrod.show();
        console.log('nothing, try again');
        return;
    }

    var x = Math.floor(boat.x / level.map.tileWidth);
    var y = Math.floor(boat.y / level.map.tileHeight);
    var tile_type = segment.getTileType(x, y);

    var tags = [tile_type];
    if (tile_type === 'Deep sea') {
        tags.push('Shallow sea');
    }

    // TODO: Pass a random number based on the fishing rod's properties?
    var entity = loot.getLoot(tags);
    console.log('Got a '+entity.name);

    sprite.frame = entity.weight > 1 ? 10 : 9;

    cur_loot = factory.create('loot', entity);
}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return sprite; },
    enumerable: true
});
