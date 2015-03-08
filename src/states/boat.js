"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var cu              = require('config_utils');
var input           = require('controllers/input');
var level           = require('controllers/level');
var player          = require('entities/player');
var pier            = require('entities/pier');
var physics         = require('helpers/phaser/physics');
var segment         = require('generators/segment');
var list            = require('utils/list');
var ui              = require('ui/ui_manager');

var game;
var coord = {};
var layer_main;
var map_data;

module.exports.init = function(options) {
    map_data = segment.generate(0, 0, 2);
};

module.exports.create = function() {
    var game_config = config.get('game');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    physics.init(game);
    input.init(game);

    layer_main = level.createLayer(game, {
        // debug: true,
        // tileset: 'tilemap-simple',
        name: 'main',
        data: list.printString(map_data.tiles, map_data.width)
    });

    pier.create(level.map.tileWidth,
                level.map.tileHeight,
                map_data.meta.pier_pos);

    player.init(game, {
        layer:         layer_main,
        tile_width:    level.map.tileWidth,
        tile_height:   level.map.tileHeight,
        spawn_pos:     map_data.meta.boat_pos
    });

    ui.init(game);
};

module.exports.update = function() {
    // coord.x = layer_main.getTileX(input.pointer.worldX);
    // coord.y = layer_main.getTileY(input.pointer.worldY);
};

module.exports.render = function() {
    // game.debug.text(coord.x+' : '+coord.y, 16, 16, 'rgb(255,255,255)');
    // game.debug.body(player.current.sprite);
};
