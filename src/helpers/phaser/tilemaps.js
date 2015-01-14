"use strict";

var tilemaps = {};

module.exports.loadTilemap = function(game, options) {
    options.tile_size = options.tile_size || 16;
    options.layer_index = options.layer_index || 0;

    game.load.tilemap(options.map_name, null, options.data);

    var ref = tilemaps[options.map_name] = {map: null, layer: null};

    ref.map = game.add.tilemap(options.map_name, options.tile_size, options.tile_size);
    ref.map.addTilesetImage(options.tileset);

    ref.layer = ref.map.createLayer(options.layer_index);
    ref.layer.resizeWorld();
}

module.exports.layer = function(name) {
    var tilemap = tilemaps[name];
    return tilemap ? tilemap.layer : null;
}
