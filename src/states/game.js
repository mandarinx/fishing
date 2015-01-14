"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var world           = require('generators/world');

var game = null;
var coordinate = {x: -1, y: -1};

module.exports.init = function(options) {
    if (typeof options === 'undefined') {
        console.log('Game state is missing options');
        return;
    }

    coordinate.x = options.x;
    coordinate.y = options.y;

    world.generate(options.x, options.y, options.map_type);
};

module.exports.create = function() {
    var game_config = config.get('game');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    // var segment = world.get(coordinate.x, coordinate.y);
    // segment: {
    //     tiles: []
    //     width: 16
    //     name: ''
    // }

    // tilemaps.loadTilemap(game, {
    //     map_name:   segment.name,
    //     data:       list.printString(segment.tiles),
    //     tileset:    'worldmap'
    // });

};
