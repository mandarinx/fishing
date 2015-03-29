"use strict";

var config          = require('config');
var type            = require('utils/type');
var list            = require('utils/list');

var level_config;
var map;
var layers = {};

module.exports.createMap = function(game, options) {
    if (type(options).is_undefined) {
        console.log('Level controller needs certain options to work');
        return null;
    }

    level_config = config.get('level');

    var debug = options.debug || level_config.debug;
    var name = options.name || 'Unnamed';

    if (type(options.data).is_array) {
        options.data = list.printString(options.data);
    }

    if (type(options.tileset).is_undefined) {
        options.tileset = level_config.tileset;
    }

    createMap(game, options);

    return this.addLayer(options.name, debug);
};

module.exports.addLayer = function(name, debug) {
    if (type(layers[name]).is_undefined) {
        layers[name] = addLayer(debug);
    }
    return layers[name];
};

module.exports.getLayer = function(name) {
    return layers[name];
};

module.exports.removeLayer = function(game, name) {
    var layer = layers[name];
    layer.destroy();
    layers[name] = undefined;
};

module.exports.setCollision = function(include) {
    if (!type(include).is_array &&
        !type(include).is_number) {
        console.log('Includes must be either a number or an array');
        return;
    }

    var excludes = map.collideIndexes.map(function(index) {
        return index;
    });
    map.setCollision(excludes, false);
    map.setCollision(include, true);
};

Object.defineProperty(module.exports, 'map', {
    get: function() { return map; }
});

function addLayer(debug) {
    var index = 0;
    if (!type(Object(layers).keys).is_undefined) {
        index = Object(layers).keys.length;
    }
    var layer = map.createLayer(index);
    layer.resizeWorld();
    layer.debug = debug;
    return layer;
}

function createMap(game, options) {
    options.tile_size = options.tile_size || 16;
    // options.layer_index = options.layer_index || 0;

    game.load.tilemap('map', undefined, options.data);
    map = game.add.tilemap('map', options.tile_size, options.tile_size);
    map.addTilesetImage(options.tileset);
}
