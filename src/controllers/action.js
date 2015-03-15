"use strict";

var Action = {
    callbacks: [],

    add: function(cb) {
        if (!this.exists(cb)) {
            this.callbacks.push(cb);
        }
    },

    remove: function(cb) {
        for (var i=this.callbacks.length-1; i>=0; i--) {
            if (this.callbacks[i] === cb) {
                this.callbacks.splice(i, 1);
                break;
            }
        }
    },

    exists: function(cb) {
        for (var i=0; i<this.callbacks.length; i++) {
            if (this.callbacks[i] === cb) {
                return true;
            }
        }
        return false;
    },

    execute: function() {
        this.callbacks[this.callbacks.length - 1]();
    }
};

module.exports.create = function() {
    return Object.create(Action);
}
