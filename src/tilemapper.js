var gridcreator     = require('data/grid');
var list            = require('utils/list');

module.exports.map = function(grid, data_types, tilemap) {
    list.each(grid.data, grid.width, function(tile_value, x, y, i) {
        grid.tiles[i] = tilemap[tile_value];
    });
};
