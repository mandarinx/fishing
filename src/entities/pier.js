"use strict";

var physics         = require('helpers/phaser/physics');
var ui              = require('ui/ui_manager');

var bounds;

module.exports.create = function(layer, map_data) {
    var tw = layer.map.tileWidth;
    var th = layer.map.tileHeight;
    var x = (tw * map_data.meta.pier_pos.x) - tw;
    var y = (th * map_data.meta.pier_pos.y) - th;

    bounds = new Phaser.Rectangle(x, y, tw * 3, th * 3);
    physics.addOverlap(bounds, this.overlap);
}

module.exports.overlap = function(player) {
    // show label in UI
    // set some state variable on player
    ui.action_label.text = 'Dock [Space]';
}
