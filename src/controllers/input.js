"use strict";

var config          = require('config');
var type            = require('utils/type');

var keys = {};
var key_codes = [];
var states = {};
var pointer;
var game;

module.exports.init = function(g) {
    game = g;

    registerKeys(config.get('input', 'keys'));
    pointer = game.input.activePointer;

    // Stop the key events from propagating up to the browser
    game.input.keyboard.addKeyCapture(key_codes);
}

module.exports.keys = function(name) {
    return keys[name];
}

function registerKeys(keys_config) {
    Object.keys(keys_config).forEach(function(name) {
        var settings = keys_config[name];
        addKey(settings.key_code, name);

        Object.defineProperty(module.exports, name, {
            get: function() { return keys[name]; }
        });
    });
}

function addKey(key_code, name) {
    key_codes.push(Phaser.Keyboard[key_code]);
    keys[name] = game.input.keyboard.addKey(key_codes[key_codes.length-1]);
    keys[name].name = name;
}

Object.defineProperty(module.exports, 'pointer', {
    get: function() { return pointer; }
});
