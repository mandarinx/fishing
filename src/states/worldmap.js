"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var worldmap        = require('generators/worldmap');

var marker      = {x:0, y:0};
var cur_tile    = {x:0, y:0};
var layer       = {};
var tilesize    = 32;
var pointer     = {};
var game        = null;

module.exports.create = function() {
    var game_config = config.get('game');
    var mapname = 'worldmap';

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;
    pointer = game.input.activePointer;

    tilemaps.loadTilemap(game, {
        map_name:       mapname,
        data:           list.printString(worldmap.map.tiles),
        tile_size:      tilesize,
        tileset:        'worldmap'
    });

    marker = game.add.sprite(0, 0, 'sprites');
    layer = tilemaps.layer(mapname);

    game.input.onUp.add(click, this);
};

module.exports.update = function() {
    cur_tile.x = layer.getTileX(pointer.worldX);
    cur_tile.y = layer.getTileY(pointer.worldY);

    marker.x = cur_tile.x * tilesize;
    marker.y = cur_tile.y * tilesize;
};

function click() {
    var map_type = list.get(worldmap.map.data,
                            cur_tile.x,
                            cur_tile.y,
                            worldmap.map.width);

    game.input.onUp.remove(click, this);

    game.state.start('Game', true, false, {
        map_type:   map_type,
        x:          cur_tile.x,
        y:          cur_tile.y
    });
}
