"use strict";

if (document.readyState === 'complete' ||
    document.readyState === 'interactive') {
    window.setTimeout(_boot, 0);
} else {
    document.addEventListener('DOMContentLoaded', _boot, false);
    window.addEventListener('load', _boot, false);
}

var retries = 0;
var max_retries = 800;
var wait_time = 20;

function _phaser_ready() {
    if (typeof window.Phaser !== 'undefined') {
        window.log = console.log.bind(console);

        var extensions = require('utils/extensions');
        var fishing = require('fishing');
        fishing();

    } else {
        if (retries < max_retries) {
            window.setTimeout(_phaser_ready, wait_time);
            retries++;
        } else {
            console.log('Phaser not loaded after '+
                        ((max_retries * wait_time) / 1000)+
                        ' seconds. Aborting.');
        }
    }
}

function _boot() {
    if (!document.body) {
        window.setTimeout(_boot, 20);
    } else {
        document.removeEventListener('DOMContentLoaded', _boot);
        window.removeEventListener('load', _boot);
        window.setTimeout(_phaser_ready, wait_time);
    }
};
