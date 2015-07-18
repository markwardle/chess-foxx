'use strict';
var db = require("org/arangodb").db;

function dropCollection(name) {
    var collectionName = applicationContext.collectionName(name);
    db._drop(collectionName);
}

drop('positions');
drop('games');
drop('users');
drop('players');
drop('lessons');

drop('moves');
drop('notes');

