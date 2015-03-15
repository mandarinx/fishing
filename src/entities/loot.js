"use strict";

var sprite;

var loot = {
    init: function(game) {
        sprite = game.make.sprite(0, 0, 'sprites-16');
        sprite.frame = this.settings.sprite_index;
        sprite.anchor.setTo(0.5, 1);
    }
};

module.exports = loot;

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return sprite; },
    enumerable: true
});
