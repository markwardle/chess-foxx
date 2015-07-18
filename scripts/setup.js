(function() {
    'use strict';
    var db = require("org/arangodb").db;

    function createCollection(name, isEdgeCollection) {
        var collectionName = applicationContext.collectionName(name);
        if (db._collection(collectionName) === null) {
            if (isEdgeCollection) {
                db._createEdgeCollection(collectionName);
            } else {
                db._create(collectionName);
            }
        } else if (applicationContext.isProduction) {
            console.warn("collection '%s' already exists. Leaving it untouched.", collectionName);
        }
    }

    createCollection('positions', false);
    createCollection('games', false);
    createCollection('users', false);
    createCollection('players', false);
    createCollection('lessons', false);

    createCollection('moves', true);
    createCollection('notes', true);
    createCollection('playedBy', true);

})();

