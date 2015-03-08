"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var level           = require('controllers/level');
var world           = require('generators/world');
var unobtrusive     = require('ui/components/unobtrusive_label');

var marker      = {x:0, y:0};
var cur_tile    = {x:0, y:0};
var layer       = {};
var tilesize    = 32;
var pointer     = {};
var game        = null;

var pick_island_label = null;

module.exports.create = function() {
    var game_config = config.get('game');
    var mapname = 'worldmap';

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;
    pointer = game.input.activePointer;

    layer = level.createMap(game, {
        // debug: true,
        tileset: 'worldmap-simple',
        name: 'worldmap',
        tile_size: 32,
        data: list.printString(world.map.tiles, world.map.width)
    });

    marker = game.add.sprite(0, 0, 'sprites-32');
    marker.frame = 3;

    game.add.bitmapText(16, 16, 'Gamegirl', 'Worldmap', 8);

    pick_island_label = unobtrusive.create({
        game:   game,
        sprite: 'label-pick-island'
    });

    game.input.onUp.add(click, this);
};

module.exports.shutdown = function() {
    game.input.onUp.remove(click, this);
    level.removeLayer(game, 'worldmap');
};

module.exports.update = function() {
    cur_tile.x = layer.getTileX(pointer.worldX);
    cur_tile.y = layer.getTileY(pointer.worldY);

    marker.x = cur_tile.x * tilesize;
    marker.y = cur_tile.y * tilesize;

    pick_island_label.update(pointer);
};

function click() {
    var map_type = list.get(world.map.data,
                            cur_tile.x,
                            cur_tile.y,
                            world.map.width);

    game.state.start('Game', true, false, {
        map_type:   map_type,
        x:          cur_tile.x,
        y:          cur_tile.y
    });
}
