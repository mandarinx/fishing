"use strict";

var config          = require('config');

var loot_config;

module.exports.getLoot = function(tags) {
    // iterate loot_config
        // pick loot that match any of the tags
    // get total weight
    // var cur_upper = 0
    // iterate results
        // calculate entity weight factor
            // entity.weight / total weight
        // set entity lower_chance = cur_upper
        // set entity upper_chance = cur_upper + entity weight factor
        // cur_upper = entity.upper_chance
    // roll the dice
    // return an entity
        // iterate results
            // pick entity where random is >= && < entity lower and upper chance

    // TODO: consider getting config from an init() function
    loot_config = config.get('entities', 'loot');
    var loot_list = [];

    loot_config.forEach(function(loot) {
        if (tagsMatch(loot.tags, tags)) {
            loot_list.push(loot);
        }
    });

    var total_weight = getTotalWeight(loot_list);
    var cur_upper = 0;

    loot_list.forEach(function(loot) {
        loot._chance_lower = cur_upper;
        loot._chance_upper = cur_upper + (loot.weight / total_weight);
        cur_upper = loot._chance_upper;
    });

    return getLootFrom(loot_list);
}

function getLootFrom(entities) {
    var rnd = Math.random();
    var entity;
    for (var i=0; i<entities.length; i++) {
        entity = entities[i];
        console.log(rnd, entity._chance_lower, entity._chance_upper);
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

function getTotalWeight(entities) {
    var total = 0;
    entities.forEach(function(entity) {
        total += parseInt(entity.weight);
    });
    return total;
}
