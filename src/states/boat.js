"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var physics         = require('helpers/phaser/physics');
var segment         = require('generators/segment');
var player          = require('entities/player');
var pier            = require('entities/pier');
var input           = require('controllers/input');
var ui              = require('ui/ui_manager');

var game;
var coord = {};
var layer;
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

    tilemaps.loadTilemap(game, {
        map_name:   'BoatPracticing',
        data:       list.printString(map_data.tiles),
        tileset:    'tilemap-simple'
    });

    layer = tilemaps.layer('BoatPracticing');
    // layer.debug = true;

    // Need to switch collision between player/boat switches
    // Dispatch a player switch event that the layer controller can listen
    // to and toggle the collisions
    // Get collisions from config
    layer.map.setCollision([3, 4, 5], layer);

    // Use a factory instead. Pass the level data and let the factory
    // create as many piers as necessary
    pier.create(layer, map_data);

    player.init(game, layer, map_data);

    ui.init(game);

};

module.exports.update = function() {
    coord.x = layer.getTileX(input.pointer.worldX);
    coord.y = layer.getTileY(input.pointer.worldY);
};

module.exports.render = function() {
    // game.debug.text(coord.x+' : '+coord.y, 16, 16, 'rgb(255,255,255)');
    // game.debug.body(boat.sprite);
};
