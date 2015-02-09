"use strict";

var list    = require('utils/list');
var type    = require('utils/type');
var PF      = require('pathfinding');

function Grid(width, height, value) {
    var w = width;
    var h = height;
    var pathfinder = null;
    var finder = null;

    var instance = {
        data:           [],
        tiles:          [],
        name:           'Unnamed',
        seed:           1,
        meta:           {},
        // Has to be 2D array due to the pathfinding library
        pathf_data:     [],

        init: function(value) {
            value = value || 0;
            for (var i=0, l=w * h; i<l; i++) {
                this.data.push(value);
                this.tiles.push(value);
            }
        },

        generatePathfindingData: function(walkables) {
            if (!type(walkables).is_array) {
                if (!type(walkables).is_number) {
                    console.log('generatePathfindingData needs an array or '+
                                'an integer.');
                    return;
                } else {
                    walkables = [walkables];
                }
            }

            var row = [];
            list.each(this.data, w, function(tile, x, y, i) {
                row.push(walkables.indexOf(tile) >= 0 ? 0 : 1);
                if (x === w - 1) {
                    this.pathf_data.push(row);
                    row = [];
                }
            }.bind(this));

            finder = new PF.JumpPointFinder();
        },

        findPath: function(from_x, from_y, to_x, to_y) {
            if (pathfinder === null) {
                pathfinder = new PF.Grid(w,
                                         this.pathf_data.length,
                                         this.pathf_data);
            } else {
                pathfinder = pathfinder.clone();
            }

            return finder.findPath(from_x, from_y, to_x, to_y, pathfinder);
        }

    };

    if (typeof value !== 'undefined') {
        instance.init(value);
    }

    get(instance, 'width', function() {
        return w;
    });

    get(instance, 'height', function() {
        return this.data.length / w;
    });

    get(instance, 'length', function() {
        return this.data.length;
    });

    return instance;
}

function get(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        get: cb,
        enumerable: true
    });
}

function set(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        set:        cb,
        enumerable: true
    });
}

function getset(obj, prop, get_cb, set_cb) {
    Object.defineProperty(obj, prop, {
        // get:        get_cb,
        // set:        set_cb,
        enumerable: true,
        writable:   true,
        configurable:   true
    });
}

module.exports.create = function(width, height, value) {
    return new Grid(width, height, value);
}
