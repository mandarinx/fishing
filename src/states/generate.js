module.exports = new Phaser.State();

var worldmap = require('generators/worldmap');

module.exports.create = function() {

    worldmap.generate();
    worldmap.print();

};
