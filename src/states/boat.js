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

module.exports.init = function(options) {
    segment.generate(0, 0, 1);
};

module.exports.create = function() {
    var game_config = config.get('game');
    var physics_system = config.get('game', 'physics_system');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;
    game.physics.startSystem(Phaser.Physics[physics_system]);

    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    var seg = segment.get(0, 0);

    tilemaps.loadTilemap(game, {
        map_name:   'BoatPracticing',
        data:       list.printString(seg.tiles),
        tileset:    'tilemap-simple'
    });

    cursors = game.input.keyboard.createCursorKeys();
    pointer = game.input.activePointer;

    var map = tilemaps.layer('BoatPracticing').map;

    boat.create(game, map.tileWidth * 16, map.tileHeight * 16);
};

module.exports.update = function() {
    boat.update(cursors, pointer);
};
