"use strict";

// TODO: Plane component draws a square using game.graphics, but will
// later be replaced with loading an image from cache, or somewhere.

var graphics;

module.exports.create = function(game, x, y, w, h, color) {
    graphics = game.add.graphics(x, y);
    graphics.beginFill(color);
    graphics.drawRect(0, 0, w, h);
    graphics.endFill();
    return graphics;
};

module.exports.show = function() {
    graphics.visible = true;
}

module.exports.hide = function() {
    graphics.visible = false;
}
