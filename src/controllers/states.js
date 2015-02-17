"use strict";

var type = require('utils/type');

module.exports.add = function(owner, name, callback) {
    if (type(owner.__states).is_undefined) {
        owner.__states = {};
    }
    owner.__states[name] = callback;
}

module.exports.set = function(owner, name) {
    if (!type(owner.__states).is_object) {
        return;
    }

    if (type(name).is_array) {
        for (var i=0; i<name.length; i++) {
            if (!type(owner.__states[name[i]]).is_undefined) {
                owner.__current_state = owner.__states[name[i]];
                return;
            }
        }
    }

    if (!type(owner.__states[name]).is_undefined) {
        owner.__current_state = owner.__states[name];
    }
}

module.exports.current = function(owner) {
    owner.__current_state();
}
