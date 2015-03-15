"use strict";

var entities    = require('entities/index');
var type        = require('utils/type');

var game;

var factory = {
    init: function(g) {
        game = g;
    },

    create: function(entity_type, settings) {
        if (type(entity_type).is_undefined) {
            console.log('Factory.create missing entity type');
            return;
        }

        var entity = entities[entity_type];
        if (type(entity).is_undefined) {
            console.log('Factory.create does not recognize '+entity_type+
                        ' as an entity');
            return;
        }

        var entity_properties = undefined;

        if (!type(settings).is_undefined) {
            entity_properties = {
                settings: {
                    writable:   false,
                    value:      settings
                },
            };
        }

        var instance = Object.create(entity, entity_properties);
        instance.init(game);
        return instance;
    }
};

module.exports = factory;
