"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var input           = require('controllers/input');
var level           = require('controllers/level');
var segment         = require('generators/segment');
var grid            = require('data/grid');
var list            = require('utils/list');
var tilemapper      = require('tilemapper');
var physics         = require('helpers/phaser/physics');

var game;
var layer_main;
var map_data;
var map;
var tile_size = 16;
var player;
var layer;

module.exports.init = function(options) {
    map_data = grid.create(32, 32, 1);

    map_data.data.each(map_data.width, function (value, x, y, i) {
        if (x > 8 && x < 24 && y > 4 && y < 8) {
            map_data.data[i] = 2;
        }
    });
};

module.exports.create = function() {
    var game_config = config.get('game');
    var level_config = config.get('level');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    // input.up.onUp.add(moveUp);
    // input.down.onUp.add(moveDown);
    // input.right.onUp.add(moveRight);
    // input.left.onUp.add(moveLeft);

    input.init(game);
    physics.init(game);

    tilemapper.map(map_data,
                   config.get('map').data_types,
                   config.get('map').tilemaps.segment);

    game.load.tilemap('map',
                      undefined,
                      list.printString(map_data.tiles, map_data.width));
    map = game.add.tilemap('map', tile_size, tile_size);
    map.addTilesetImage(level_config.tileset);

    layer = map.createLayer(0);
    layer.resizeWorld();

    player = game.add.sprite(256, 256, 'sprites-16');
    player.frame = 4;
    physics.enable(player);

};

module.exports.update = function() {
    physics.collide(player, layer);

    player.body.velocity.x *= 0.2;
    player.body.velocity.y *= 0.2;

    if (input.up.isDown) {
        player.body.velocity.y = -50;
    } else if (input.down.isDown) {
        player.body.velocity.y = 50;
    }

    if (input.left.isDown) {
        player.body.velocity.x = -50;
    } else if (input.right.isDown) {
        player.body.velocity.x = 50;
    }
};

module.exports.shutdown = function() {
    level.removeLayer(game, 'island');
};

// module.exports.render = function() {
//     game.debug.body(player.current.sprite);
// };

function moveUp() {}

function moveDown() {}

function moveLeft() {}

function moveRight() {}
