"use strict";

var config = require('config');

module.exports = new Phaser.State();

module.exports.preload = function() {
    var assets = config.get('preload');
    Object.keys(assets).forEach(function(type) {
        Object.keys(assets[type]).forEach(function(id) {
            this.game.load[type].apply(this.game.load,
                                       [id].concat(assets[type][id]));
        }.bind(this));
    }.bind(this));
};

module.exports.update = function() {
    if (this.game.load.hasLoaded) {

        // TODO:
        // There should be an easy way to get the next state without
        // knowing the name of the state

        this.game.state.start('Boat');
        // this.game.state.start('Generate');

    }
};
