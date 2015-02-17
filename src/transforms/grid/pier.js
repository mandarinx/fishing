"use strict";

var config          = require('config');
var cu              = require('config_utils');

var type;
var data_types;

module.exports.place = function(segment, area) {
    var pier_positions = [];

    data_types = config.get('map').data_types;
    type = {
        shallow_sea:    cu.getDataTypeValue('Shallow sea'),
        island:         cu.getDataTypeValue('Island'),
        pier:           cu.getDataTypeValue('Pier')
    }

    segment.generatePathfindingData([type.shallow_sea]);

    // Could this be simplified?
    area.forEach(function(tile_index) {
        var above = segment.data[tile_index - segment.width];
        var below = segment.data[tile_index + segment.width];
        var left = segment.data[tile_index - 1];
        var at_right = segment.data[tile_index + 1];

        var neighbour_sea = (above === type.shallow_sea ? 1 : 0) +
                            (at_right === type.shallow_sea ? 1 : 0) +
                            (below === type.shallow_sea ? 1 : 0) +
                            (left === type.shallow_sea ? 1 : 0);

        if (neighbour_sea === 1) {

            var neighbour_island = (above === type.island ? 1 : 0) +
                                   (at_right === type.island ? 1 : 0) +
                                   (below === type.island ? 1 : 0) +
                                   (left === type.island ? 1 : 0);

            if (neighbour_island === 3) {

                var tl = segment.data[(tile_index - segment.width) - 1];
                var tr = segment.data[(tile_index - segment.width) + 1];
                var bl = segment.data[(tile_index + segment.width) - 1];
                var br = segment.data[(tile_index + segment.width) + 1];

                // Sea tiles diagonally neighbouring
                var ds = (tl === type.shallow_sea ? 1 : 0) +
                         (tr === type.shallow_sea ? 1 : 0) +
                         (bl === type.shallow_sea ? 1 : 0) +
                         (br === type.shallow_sea ? 1 : 0);

                if (ds === 2) {
                    var coord = getNeighbouringWaterTile(tile_index, segment);
                    if (coord) {
                        pier_positions.push(coord);
                    }
                }
            }
        }
    });

    if (pier_positions.length === 0) {
        console.log('no valid positions!');
        return;
    }

    var found = false;

    while (!found) {
        if (pier_positions.length === 0) {
            console.log('Could not find a suitable place for a pier');
            found = true;
        }

        var len = pier_positions.length > 1 ? pier_positions.length - 1 : 0;
        var index = Math.round(Math.random() * len);
        var pos = pier_positions.splice(index, 1)[0];

        var path = segment.findPath(pos.x, pos.y, 0, 0);
        if (path.length > 0) {
            var end = path[path.length - 1];
            if (end[0] === 0 && end[1] === 0) {
                var pier_pos = (pos.y * segment.width) + pos.x;
                segment.data[pier_pos] = type.pier;
                segment.meta.pier_pos = {x: pos.x, y: pos.y};
                segment.meta.boat_pos = getBoatPos(segment, pier_pos);
                found = true;
            }
        }
    }
}

function getBoatPos(segment, pier_pos) {
    var neighbours = [
        pier_pos - segment.width,
        pier_pos + 1,
        pier_pos + segment.width,
        pier_pos - 1
    ];
    var opposites = [
        pier_pos + segment.width,
        pier_pos - 1,
        pier_pos - segment.width,
        pier_pos + 1
    ];

    for (var i=0; i<neighbours.length; i++) {
        var n = neighbours[i];
        if (segment.data[n] === type.island) {
            return coordForIndex(opposites[i], segment.width);
        }
    }

    return null;
}

function getNeighbouringWaterTile(tile_index, segment) {
    var neighbours = [
        tile_index - segment.width,
        tile_index + 1,
        tile_index + segment.width,
        tile_index - 1
    ];

    for (var i=0; i<neighbours.length; i++) {
        var n = neighbours[i];
        if (segment.data[n] === type.shallow_sea) {
            return coordForIndex(n, segment.width);
        }
    }

    return null;
}

function coordForIndex(index, w) {
    return {
        y: Math.floor(index / w),
        x: index - (w * Math.floor(index / w))
    };
}
