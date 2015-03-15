"use strict";

var segment     = require('generators/segment');
var level       = require('controllers/level');
var loot        = require('controllers/loot');
var type        = require('utils/type');
var list        = require('utils/list');
var cu          = require('config_utils');

var sprite;
var game;
var boat;
var timer;
var loot;

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
        if (!type(timer).is_undefined) {
            timer.stop(true);
        }
        // if loot != undefined
            // dispatch got loot event with current loot
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

function timerDone() {

    // TODO: I want to call an animation by play, and have it loop
    // until the player hits the action key, without having to manually
    // call update on the rod

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
    var entity = loot.getLoot(tags);
    console.log('Got a '+entity.name);

    // var chance = tile_type === 'Shallow sea' ? 0.5 : 0.4;
    // var fish = tile_type === 'Shallow sea' ? 'small' : 'large';

    // // TODO: The chance of getting a fish is affected by the effectiveness
    // // of the fishing rod. Or maybe the bait?

    // if (Math.random() >= chance) {
    //     console.log('Got a '+fish+' fish');
    // }
    // roll the dice
        // got fish?
            // tile deep? play animation for big : small
            // tile deep ? use factory to create random big fish : small
            // exit
        // no fish
            // start new timer

}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return sprite; },
    enumerable: true
});
