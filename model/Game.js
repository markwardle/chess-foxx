var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var GameModel = Foxx.Model.extend({
    schema: {
        pgn: joi.string().required().description('The portable game notation for the game'),
        date: joi.date().format('YYYYMMDD').optional().description('The date the match was played'),
        site: joi.string().optional().description('Where the match was played'),
        victor: joi.string().valid('white', 'black', 'draw', 'other').optional().description('The side that won')
    }
});

var GameRepository = Foxx.Repository.extend({});

exports.model = GameModel;
exports.repository = GameRepository;
