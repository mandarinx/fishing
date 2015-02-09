"use strict";

module.exports.getDataTypeValue = function(data_types, name) {
    var dt;
    for (var i=0; i<data_types.length; i++) {
        dt = data_types[i];
        if (dt.name === name) {
            return dt.value;
        }
    }
    return null;
}
