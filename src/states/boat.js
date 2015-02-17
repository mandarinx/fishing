"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var physics         = require('helpers/phaser/physics');
var segment         = require('generators/segment');
var boat            = require('entities/boat');
var player          = require('entities/player');
var pier            = require('entities/pier');
var ui              = require('ui/ui_manager');

var game;
// TODO: Bundle cursors and pointer in an input manager. The input manager
// accepts a key mapping object from config
var cursors;
var pointer;
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

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT,
                                      Phaser.Keyboard.RIGHT,
                                      Phaser.Keyboard.SPACEBAR]);


    tilemaps.loadTilemap(game, {
        map_name:   'BoatPracticing',
        data:       list.printString(map_data.tiles),
        tileset:    'tilemap-simple'
    });

    layer = tilemaps.layer('BoatPracticing');
    // layer.debug = true;

    // Need to switch collision between player/boat switches
    layer.map.setCollision([3, 4, 5], 'BoatPracticing');

    cursors = game.input.keyboard.createCursorKeys();
    pointer = game.input.activePointer;

    pier.create(layer, map_data);

    // TODO: Merge boat and player
    boat.create(game,
                layer.map.tileWidth * map_data.meta.boat_pos.x,
                layer.map.tileHeight * map_data.meta.boat_pos.y);

    // player.create(game,
    //               layer.map.tileWidth * 16,
    //               layer.map.tileHeight * 16);

    ui.init(game);

};

module.exports.update = function() {
    coord.x = layer.getTileX(pointer.worldX);
    coord.y = layer.getTileY(pointer.worldY);

    boat.update(cursors, pointer, layer);
    // player.update(cursors, pointer, layer);
};

module.exports.render = function() {
    // game.debug.text(coord.x+' : '+coord.y, 16, 16, 'rgb(255,255,255)');
    // game.debug.body(boat.sprite);
};
