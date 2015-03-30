"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var input           = require('controllers/input');
var segment         = require('generators/segment');
var grid            = require('data/grid');
var list            = require('utils/list');

var game;
var layer_main;
var map_data;
var map;
var tile_size = 16;
var layer;
var cur_x = 5;
var cur_y = 5;
var game_config;
var level_config;
var includes = [3, 4, 5];

module.exports.init = function(options) {};

module.exports.create = function() {
    game_config = config.get('game');
    level_config = config.get('level');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    input.init(game);

    input.up.onUp.add(moveUp);
    input.down.onUp.add(moveDown);
    input.right.onUp.add(moveRight);
    input.left.onUp.add(moveLeft);
    input.action.onUp.add(bugger);

    load(cur_x, cur_y);
};

function load(x, y) {
    map_data = segment.generate(cur_x, cur_y, 2);
    game.load.tilemap('map',
                      undefined,
                      list.printString(map_data.tiles, map_data.width));
    map = game.add.tilemap('map', tile_size, tile_size);
    map.addTilesetImage(level_config.tileset);

    var excludes = map.collideIndexes.map(function(index) {
        return index;
    });
    map.setCollision(excludes, false);
    map.setCollision(includes, true);

    // console.log(map);

    if (layer) {
        game.world.remove(layer);
    }
    layer = map.createLayer(0);
    layer.name = segment.current.seed;
    // layer.resizeWorld();
    // layer.debug = true;

    // console.log(game.world.children);
}

function moveUp() {
    load(cur_x, --cur_y);
}

function moveDown() {
    load(cur_x, ++cur_y);
}

function moveLeft() {}

function moveRight() {}

function bugger() {
    layer.debug = !layer.debug;
    console.log(layer.debug);
}
