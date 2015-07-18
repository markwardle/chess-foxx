var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

var UserModel = Foxx.Model.extend({
    schema: {
        name: joi.string().required().maxLength(50).description('The name of the user').example('Robert James Fischer'),
        email: joi.object.keys({
            address: joi.string().email().required().description('The user\'s email address'),
            verified: joi.boolean().required().default(false).description('Whether or not the email address has been verified')
        }).required(),
        roles: joi.array().items(joi.string()).unique().description('The roles the user has'),

        auth: joi.object.keys({
            token: joi.string().description('The user\'s application token'),
            password: joi.string().description('The user\'s hashed password')
            //google: joi.string().description('The user\s google oauth token')
        }).required().description('Authorization data for the user')
    },

    isAdmin: function isAdmin() {
        var roles = this.get('roles');
        return roles.indexOf('admin') > -1;
    }
});

var UserRepository = Foxx.Repository.extend({
        indexes: [
            {
                type: 'hash',
                fields: ['auth.token']
            },
            {
                type: 'hash',
                fields: ['email.address']
            }
        ],

        byToken: function (token) {
            return this.firstExample({'auth.token': token});
        },

        byEmail: function(email) {
            return this.firstExample({'email.address': email});
        }
    }
);

exports.model = UserModel;
exports.repository = UserRepository;
