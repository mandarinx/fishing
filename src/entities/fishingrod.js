"use strict";

var sprite;
var game;

module.exports.init = function(g, boat) {
    game = g;

    sprite = game.make.sprite(0, 0, 'sprites-16');
    sprite.frame = 8;
    sprite.anchor.setTo(0, 0.5);

    boat.addChild(sprite);

    this.hide();
};

module.exports.hide = function() {
    sprite.visible = false;
};

module.exports.show = function(visible) {
    sprite.visible = visible || true;
    // TODO: do some fishing!
};

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return sprite; },
    enumerable: true
});
