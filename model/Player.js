var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var PlayerModel = Foxx.Model.extend({
    schema: {
        name: string().required().maxLength(50).description('The name of the player').example('Robert James Fischer'),
        biography: string().optional().description('A biography of the player')
    }
});

var PlayerRepository = Foxx.Repository.extend({});

exports.model = PlayerModel;
exports.repository = PlayerRepository;