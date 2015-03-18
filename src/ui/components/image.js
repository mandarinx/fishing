"use strict";

module.exports.create = function(game, x, y, w, h, color) {
    var graphics = game.add.graphics(x, y);
    graphics.beginFill(color);
    graphics.drawRect(0, 0, w, h);
    graphics.endFill();
    return graphics;
};
