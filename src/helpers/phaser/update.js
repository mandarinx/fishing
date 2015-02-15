"use strict";

// Use this module to hook up an update function to Phaser's update loop

// TODO: Figure out a way to get rid of the init function so the module
// can initialize itself

var updates = [];
var inited = false;

module.exports = {
    init: function() {
        var game = require('states/boot').game;
        game.world.children.push(this);
        inited = true;
    },

    register: function(entity) {
        if (!inited) {
            this.init();
        }

        updates.push(entity);
    },

    update: function() {
        for (var i=0, j=updates.length; i<j; i++) {
            updates[i].update();
        }
    },

    // When adding a non-Phaser object to Phaser's update loop, the object
    // needs these functions in order not to throw errors.
    preUpdate: function() {},
    postUpdate: function() {},
    updateTransform: function() {},
    _renderCanvas: function() {},
};
