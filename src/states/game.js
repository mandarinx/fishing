"use strict";

module.exports = new Phaser.State();

var config          = require('config');
var list            = require('utils/list');
var tilemaps        = require('helpers/phaser/tilemaps');
var segment         = require('generators/segment');

var game            = null;
var coordinate      = {x: -1, y: -1};
var key_map         = null;

module.exports.init = function(options) {
    if (typeof options === 'undefined') {
        console.log('Game state is missing options');
        return;
    }

    coordinate.x = options.x;
    coordinate.y = options.y;

    segment.generate(options.x, options.y, options.map_type);
};

module.exports.create = function() {
    var game_config = config.get('game');

    game = this.game;
    game.stage.backgroundColor = game_config.background_color;

    var seg = segment.get(coordinate.x, coordinate.y);

    tilemaps.loadTilemap(game, {
        map_name:   seg.name,
        data:       list.printString(seg.tiles),
        tileset:    'tilemap-simple'
    });

    game.add.bitmapText(16, 16, 'Gamegirl', '[M] Return to worldmap', 8);
    game.add.bitmapText(16, 32, 'Gamegirl', seg.name, 8);

    key_map = game.input.keyboard.addKey(Phaser.Keyboard.M);
    key_map.onUp.add(returnToWorldmap, this);
};

module.exports.shutdown = function() {
    key_map.onUp.remove(returnToWorldmap);
};

function returnToWorldmap() {
    game.state.start('Worldmap');
}
