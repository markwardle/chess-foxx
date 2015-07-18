var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var PlayedByModel = Foxx.Model.extend({
    schema: {
        color: joi.string().valid('white', 'black')
    }
});

var PlayedByRepository = Foxx.Repository.extend({});

exports.model = PlayedByModel;
exports.repository = PlayedByRepository;