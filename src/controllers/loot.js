"use strict";

var config          = require('config');

var loot_config;

module.exports.getLoot = function(tags) {
    // TODO: consider getting config from an init() function
    loot_config = config.get('entities', 'loot');
    var loot_list = [];

    loot_config.forEach(function(loot) {
        if (tagsMatch(loot.tags, tags)) {
            loot_list.push(loot);
        }
    });

    var total_frequency = getTotalFrequency(loot_list);
    var cur_upper = 0;

    loot_list.forEach(function(loot) {
        loot._chance_lower = cur_upper;
        loot._chance_upper = cur_upper + (loot.frequency / total_frequency);
        cur_upper = loot._chance_upper;
    });

    return getLootFrom(loot_list);
}

function getLootFrom(entities) {
    var rnd = Math.random();
    var entity;
    for (var i=0; i<entities.length; i++) {
        entity = entities[i];
        if (rnd >= entity._chance_lower &&
            rnd < entity._chance_upper) {
            break;
        }
    }
    return entity;
}

function tagsMatch(entity_tags, search_tags) {
    var match = false;
    entity_tags.forEach(function(tag) {
        if (search_tags.indexOf(tag) >= 0) {
            match = true;
        }
    });
    return match;
}

function getTotalFrequency(entities) {
    var total = 0;
    entities.forEach(function(entity) {
        total += parseInt(entity.frequency);
    });
    return total;
}
