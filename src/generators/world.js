"use strict";

var list            = require('utils/list');

var world = [];

module.exports.generate = function(x, y, type) {
    if (exists(x, y)) {
        return;
    }

    // pick a seed for the world
    // use cellular automata to generate a map
    // put the map in world[]
};

module.exports.get = function(x, y, type) {
    // check if segment(x, y) has a tiles array
    // if not > run tilemapper.natural
    // return the segment
};

function exists(x, y) {
    var segment = null;
    for (var i=0; i<world.length; i++) {
        segment = world[i];
        if (segment.x === x && segment.y === y) {
            break;
        }
    }
    return segment ? true : false;
}
