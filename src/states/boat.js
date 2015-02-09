"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var segment         = require('generators/segment');
var boat            = require('entities/boat');

var game;
// TODO: Bundle cursors and pointer in an input manager. The input manager
// accepts a key mapping object from config
var cursors;
var pointer;
var layer;

module.exports.init = function(options) {
    segment.generate(0, 0, 2);
};

module.exports.create = function() {
    var game_config = config.get('game');
    var physics_system = config.get('game', 'physics_system');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;
    game.physics.startSystem(Phaser.Physics[physics_system]);

    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    var map_data = segment.get(0, 0);

    tilemaps.loadTilemap(game, {
        map_name:   'BoatPracticing',
        data:       list.printString(map_data.tiles),
        tileset:    'tilemap-simple'
    });

    layer = tilemaps.layer('BoatPracticing');
    cursors = game.input.keyboard.createCursorKeys();
    pointer = game.input.activePointer;

    boat.create(game,
                layer.map.tileWidth * map_data.meta.boat_pos.x,
                layer.map.tileHeight * map_data.meta.boat_pos.y);

};

module.exports.update = function() {
    boat.update(cursors, pointer);
};
