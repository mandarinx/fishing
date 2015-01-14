var gridcreator     = require('data/grid');
var list            = require('utils/list');

var meta = {};

module.exports.natural = function(grid, data_types) {
    meta = gridcreator.create(grid.width + 1, grid.height + 1);
    getMetaData(grid, meta);

    data_types.forEach(function(type) {
        getMetaTileIDs(grid, type);
    });
};

module.exports.direct = function(grid, data_types) {
    data_types.forEach(function(type) {
        getTileIDs(grid, type);
    });
};

// Creates ID's ranging from 0 to 15 based on a binary input
function getTileIDs(grid, data_type) {
    list.each(grid.data, grid.width, function(tile_value, x, y, i) {
        if (tile_value === data_type.value) {
            var id = getID(1, 1, 1, 1);
            var offset = data_type.tile_row_offset * 16;
            // console.log('x:'+x+' y:'+y+' id:'+id+' off:'+(id + offset));
            grid.tiles[i] = id + offset;
        }

    });
};

// Creates ID's ranging from 0 to 15 based on a binary input
function getMetaTileIDs(grid, data_type) {
    list.each(grid.data, grid.width, function(tile_value, x, y, i) {
        var tl = getFilteredMetaData(x,   y,   data_type.value);
        var tr = getFilteredMetaData(x+1, y,   data_type.value);
        var bl = getFilteredMetaData(x,   y+1, data_type.value);
        var br = getFilteredMetaData(x+1, y+1, data_type.value);

        var id = getID(tl, tr, bl, br);

        // var sig = tl+' '+tr+' '+bl+' '+br;
        // console.log('x:'+x+' y:'+y+' ('+sig+') id:'+id);

        grid.tiles[i] = id + data_type.tile_row_offset;
    });
};

function getFilteredMetaData(x, y, filter) {
    var value = list.get(meta.data, x, y, meta.width);
    return value === filter ? 1 : 0;
}

function getID(a, b, c, d) {
    return (a & 1) | (b & 1) << 1 | (c & 1) << 2 | (d & 1) << 3;
}

function getMetaData(grid, meta) {
    // Add the upper left corner
    meta.data.push(grid.data[0]);

    // Fill the first row
    for (var i=0; i<grid.width; i++) {
        meta.data.push(grid.data[i]);
    }

    // Fill the rest, duplication the left most column
    list.fill(meta.data, grid.width, grid.length, function(x, y, i) {
        if (i % grid.width === 0) {
            meta.data.push(grid.data[i]);
        }
        meta.data.push(grid.data[i]);
    });
}
