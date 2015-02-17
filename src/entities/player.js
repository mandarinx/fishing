"use strict";

var cu              = require('config_utils');
var boat            = require('entities/boat');
var fisherman       = require('entities/fisherman');
var physics         = require('helpers/phaser/physics');
var update          = require('helpers/phaser/update');
var list            = require('utils/list');

var current;
var game;
var layer;
var map_data;

module.exports.init = function(g, l, md) {
    game = g;
    layer = l;
    map_data = md;

    var x = layer.map.tileWidth * map_data.meta.boat_pos.x;
    var y = layer.map.tileHeight * map_data.meta.boat_pos.y;

    fisherman.init(game, x, y);
    boat.init(game, x, y);
    setDefault();

    // load and init all states. Read from config?

    physics.setPlayer(this);
    update.register(this);
}

module.exports.update = function() {
    physics.collide(current.sprite, layer);
    current.update();
}

// add triggerEnter, Leave and Stay
    // get name of entity passed
    // append 'on_' to the name
    // switch to state with name

function switchToBoat() {
    fisherman.hide();
    boat.show();
    current = boat;
}

function switchToFisherman() {
    boat.hide();
    fisherman.show();
    current = fisherman;
}

function setDefault() {
    var tile_type = cu.getDataType(list.get(map_data.data,
                                            map_data.meta.boat_pos.x,
                                            map_data.meta.boat_pos.y,
                                            map_data.width));

    if (matchSpawnTile(fisherman, tile_type)) {
        switchToFisherman();
    }
    if (matchSpawnTile(boat, tile_type)) {
        switchToBoat();
    }
}

function matchSpawnTile(entity, type) {
    if (entity.settings.spawn_tile instanceof Array) {
        return entity.settings.spawn_tile.indexOf(type) > -1;
    } else {
        return entity.settings.spawn_tile === type;
    }
}

Object.defineProperty(module.exports, 'sprite', {
    get: function() { return current.sprite; },
    enumerable: true
});
