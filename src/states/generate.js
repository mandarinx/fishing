"use strict";

module.exports = new Phaser.State();

var worldmap        = require('generators/worldmap');
var tilemapper      = require('tilemapper');
var config          = require('config');

module.exports.create = function() {

    var map_cfg = config.get('map');

    worldmap.generate(map_cfg.data_types);
    worldmap.print();

    tilemapper.direct(worldmap.map, map_cfg.data_types);

    this.game.state.start('Worldmap');

};
