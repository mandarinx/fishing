"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var worldmap        = require('generators/worldmap');

var maps = {};

module.exports.create = function() {
    var game = this.game;
    var game_config = config.get('game');

    game.stage.backgroundColor = game_config.background_color;

    var tileindexes = list.printString(worldmap.map.tiles);

    loadTilemap(game, {
        map_name:   'worldmap',
        data:       tileindexes,
        tile_size:  32,
        tileset:    'worldmap'
    });

    // loadTilemap(game, {
    //     map_name:   'indexdebug',
    //     data:       list.printString(worldmap.map.data),
    //     tileset:    'indexdebug'
    // });

};

function loadTilemap(game, options) {
    var tile_size = options.tile_size || 16;
    game.load.tilemap(options.map_name, null, options.data);

    maps[options.map_name] = game.add.tilemap(options.map_name, tile_size, tile_size);
    var map = maps[options.map_name];
    map.addTilesetImage(options.tileset);

    map.layer = {};
    map.layer['0'] = map.createLayer(0);
    map.layer['0'].resizeWorld();
}
