"use strict";

var on_player_change = new Phaser.Signal();

Object.defineProperty(module.exports, 'onPlayerChange', {
    get: function() { return on_player_change; },
    enumerable: true
});
