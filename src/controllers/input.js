"use strict";

var config          = require('config');

var input_config;
var inputs = {};
var key_codes = [];
var pointer;

module.exports.init = function(game) {
    input_config = config.get('input');
    registerKeys(game, input_config);
    pointer = game.input.activePointer;
    // Stop the configured keys from propagating up to the browser
    game.input.keyboard.addKeyCapture(key_codes);
}

function registerKeys(game, keys) {
    Object.keys(keys).forEach(function(key) {
        var key_id = keys[key];
        key_codes.push(Phaser.Keyboard[key_id]);
        inputs[key] = game.input.keyboard.addKey(key_codes[key_codes.length-1]);
        inputs[key].name = key_id;
    });
}

Object.defineProperty(module.exports, 'action', {
    get: function() { return inputs.action; }
});

Object.defineProperty(module.exports, 'up', {
    get: function() { return inputs.up; }
});

Object.defineProperty(module.exports, 'down', {
    get: function() { return inputs.down; }
});

Object.defineProperty(module.exports, 'left', {
    get: function() { return inputs.left; }
});

Object.defineProperty(module.exports, 'right', {
    get: function() { return inputs.right; }
});

Object.defineProperty(module.exports, 'pointer', {
    get: function() { return pointer; }
});
