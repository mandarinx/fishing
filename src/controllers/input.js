"use strict";

// TODO:
// Make a base object for the state. Register the state with
// Phaser's update chain if it is set to be single.

var config          = require('config');
var type            = require('utils/type');
var update          = require('helpers/phaser/update');

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
    update.register(this);
}

module.exports.update = function() {
    Object.keys(states).forEach(function(key) {
        states[key].update();
    });
}

module.exports.keys = function(name) {
    return states[name].key;
}

function registerKeys(keys_config) {
    Object.keys(keys_config).forEach(function(name) {
        var settings = keys_config[name];
        var key = addKey(settings.key_code, name);

        if (!type(settings.type).is_undefined) {
            if (settings.type === 'single') {
                states[name] = {
                    name: name,
                    key: settings.key_code,
                    type: 'single',
                    state: false,
                    duration: 0,
                    update: function() {
                        if (this.state) {
                            if (this.duration > 0) {
                                this.state = false;
                                this.duration = 0;
                            }
                            if (this.duration === 0) {
                                ++this.duration;
                            }
                        } else {
                            this.duration = 0;
                        }
                    }
                };

                key.onUp.add(function() {
                    states[name].state = true;
                });

                Object.defineProperty(module.exports, name, {
                    get: function() { return states[name].state; }
                });
                return;
            }
        }

        // Default to continuous
        states[name] = {
            name: name,
            key: settings.key_code,
            type: 'continuous',
            state: false,
            update: function() {}
        };

        key.onDown.add(function() {
            states[name].state = true;
        });

        key.onUp.add(function() {
            states[name].state = false;
        });

        Object.defineProperty(module.exports, name, {
            get: function() { return states[name].state; }
        });
    });
}

function addKey(key_code, name) {
    key_codes.push(Phaser.Keyboard[key_code]);
    keys[name] = game.input.keyboard.addKey(key_codes[key_codes.length-1]);
    keys[name].name = name;
    return keys[name];
}

Object.defineProperty(module.exports, 'pointer', {
    get: function() { return pointer; }
});
