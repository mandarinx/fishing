"use strict";

var config = require('config');

module.exports.getDataTypeValue = function(name) {
    var data_types = config.get('map', 'data_types');
    var dt = null;
    for (var i=0; i<data_types.length; i++) {
        dt = data_types[i];
        if (dt.name === name) {
            break;
        }
    }
    return dt.value;
}

module.exports.getDataType = function(value) {
    var data_types = config.get('map', 'data_types');
    var dt = null;
    for (var i=0; i<data_types.length; i++) {
        dt = data_types[i];
        if (dt.value === value) {
            break;
        }
    }
    return dt.name;
}
