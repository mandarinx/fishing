"use strict";

module.exports = new Phaser.State();

var world       = require('generators/world');
var tilemapper  = require('tilemapper');
var config      = require('config');

module.exports.create = function() {

    // TODO: Store the seed in a save game, e.g. localStorage.
    window.seed = Math.round(Math.random() * 10000);

    var map_cfg = config.get('map');
    world.generate(map_cfg.data_types, window.seed);

    tilemapper.map(world.map, map_cfg.data_types, map_cfg.tilemaps.worldmap);

    this.game.state.start(config.get('game', 'boot_sequence').next());

    // this.game.state.start('Game', true, false, {
    //     map_type:   2,
    //     x:          0,
    //     y:          0
    // });

};
