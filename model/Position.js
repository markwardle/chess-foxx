var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var PositionModel = Foxx.Model.extend({
    schema: {
        fen: joi.string().required(),
        advantage: joi.string().valid(
            'white',
            'black',
            'equal',
            'undetermined'
        ).default('undetermined').description('The player that has the advantage in this position')
    }
});

var PositionRepository = Foxx.Repository.extend({
    indexes: [
        {
            fields: ['fen'],
            type:'hash',
            unique: 'true'
        }
    ]
});

exports.model = PositionModel;
exports.repository = PositionRepository;
