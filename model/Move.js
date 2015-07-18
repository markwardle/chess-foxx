var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var MoveModel = Foxx.Model.extend({
    schema: {
        san: joi.string().required().description('The standard algebraic notation for the move'),
        quality: joi.string().valid(
            'mainline',    // a standard mainline move
            'brilliant',   // !!
            'good',        // !
            'interesting', // !?
            'fine',
            'questionable', // ?
            'poor',         // ??
            'bad',          // ?!
            'undetermined'
        ).default('undetermined').description('The consensus of the move\'s quality'),
        idea: joi.string().optional().description('The idea behind the move')
    }
});

var MoveRepository = Foxx.Repository.extend({
     getMovesFromPosition: Foxx.createQuery({
        query: 'FOR move IN EDGES(moves, @id, "outbound") return move',
        params: ['id']
    })
});

exports.model = MoveModel;
exports.repository = MoveRepository;
