"use strict";

var list            = require('utils/list');
var type            = require('utils/type');
var grid            = require('data/grid');
var automata        = require('generators/cellular_automata');
var automata        = require('generators/cellular_automata');
var island_name     = require('generators/island_name');
// var remapper        = require('transforms/grid/remap');
var rooms           = require('transforms/grid/rooms');
var pier            = require('transforms/grid/pier');
var config          = require('config');
var cu              = require('config_utils');
var tilemapper      = require('tilemapper');

var world           = {};
var cfg             = null;
var map_cfg         = null;
var data_types      = null;

module.exports.generate = function(x, y, type) {
    if (exists(x, y)) {
        return;
    }

    cfg = config.get('world_segment');
    map_cfg = config.get('map');
    data_types = map_cfg.data_types;
    addToCache(x, y);

    var segment = world[x][y] = grid.create(cfg.width, cfg.height, 0);
    segment.seed = Math.round(Math.random() * 10000);
    // segment.seed = 5388;
    log(segment.seed);

    // info(data_types, type, x, y, segment.seed);

    // TODO: Define the generators for each type as a recipe, and store
    // each recipe in an object with type as index

    if (type === 0) {
        // TODO: Generate sea name
        segment.name = 'Fishing sea';
        generateFishingSea(segment);
    }

    if (type === 1) {
        segment.name = 'null';
        generateShallowSea(segment);
    }

    if (type === 2) {
        segment.name = island_name.generate();
        generateIsland(segment, {
            seed:       segment.seed,
            smoothness: cfg.smoothness,
            padding:    cfg.padding,
            value_a:    cu.getDataTypeValue(data_types, 'Shallow sea'),
            value_b:    cu.getDataTypeValue(data_types, 'Island')
        });
    }

    // list.print(segment.data);

    tilemapper.map(segment, data_types, map_cfg.tilemaps.segment);
};

module.exports.get = function(x, y) {
    if (!exists(x, y)) {
        return null;
    }

    return world[x][y];
};

function generateIsland(segment, opts) {

    // TODO: Make automata a Stream
    // https://github.com/winterbe/streamjs
    automata.generate(segment, opts);

    // Remap 0's to 1's and 1's to 2's.
    // Should be better integrated with config.
    // datatype.get('Island')
    // datatype.get('Shallow sea')
    // remapper.remap(segment.data, {
    //     0: 1,
    //     1: 2
    // });

    rooms.identify(cu.getDataTypeValue(data_types, 'Island'), segment);

    // Paint each room as sand
    Object.keys(rooms.rooms).forEach(function(index) {
        var room_tiles = rooms.rooms[index];
        if (room_tiles.length < 10) {
            room_tiles.forEach(function(tile_index) {
                segment.data[tile_index] = cu.getDataTypeValue(data_types, 'Sand');
            });
        }
    });

    // Find the biggest island
    var l = 0;
    var i = -1;
    Object.keys(rooms.rooms).forEach(function(index) {
        var r = rooms.rooms[index];
        if (r.length > l) {
            l = r.length;
            i = index;
        }
    });

    pier.place(segment, rooms.rooms[i]);

}

function generateFishingSea(segment) {
    list.each(segment.data, segment.width, function(tile, x, y, i) {
        if ((x < 5) ||
            (x > segment.width - 6) ||
            (y < 5) ||
            (y > segment.height - 6)) {
            segment.data[i] = cu.getDataTypeValue(data_types, 'Shallow sea');
        } else {
            segment.data[i] = cu.getDataTypeValue(data_types, 'Deep sea');
        }
    });
}

function generateShallowSea(segment) {
    list.each(segment.data, segment.width, function(tile, x, y, i) {
        segment.data[i] = cu.getDataTypeValue(data_types, 'Shallow sea');
    });
}

function exists(x, y) {
    if (type(x).is_undefined) {
        console.log('Segment.exists : Missing x');
        return false;
    }

    if (!type(world[x]).is_undefined) {
        if (type(y).is_undefined) {
            return true;
        }
        if (!type(world[x][y]).is_undefined) {
            return true;
        }
    }
    return false;
}

function addToCache(x, y) {
    if (!exists(x)) {
        world[x] = {};
    }
    if (!exists(x, y)) {
        world[x][y] = {};
    }
}

function info(data_types, type, x, y, seed) {
    var n = '';
    data_types.forEach(function(dt) {
        if (dt.value === type) {
            n = dt.name;
        }
    });

    log('segment type:'+n+' ('+type+') x:'+x+' y:'+y+' seed:'+seed);
}
