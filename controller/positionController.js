(function positionController(){
    "use strict";

    var Foxx = require("org/arangodb/foxx"),
        log = require("console").log,
        PositionModel = require('../model/Position').model,
        PositionRepo = require('../model/Position').repository,
        MoveModel = require('../model/Move').model,
        MoveRepo = require('../model/Move').repository,
        UserModel = require('../model/Move').model,
        UserRepo = require('../model/Move').repository,
        controller = new Foxx.Controller(applicationContext, {urlPrefix: '/position'});

    var positionRepo = new PositionRepo(applicationContext.collection('positions'), {model: PositionModel});
    var moveRepo = new MoveRepo(applicationContext.collection('moves'), {model: MoveModel});
    var userRepo = new UserRepo(applicationContext.collection('users'), {model: UserModel});

    var helpers = {
        getOptions: function getOptions(req) {
            var options = {};
            var skip = req.params('skip');
            var limit = req.params('limit');
            if (skip != null) {
                options.skip = skip;
            }
            if (limit != null) {
                options.limit = limit;
            }

            return options;
        },

        _truthyValues: [true, 'true', 1, '1'],

        isTruthy: function isTruthy(value){
            return this._truthyValues.indexOf(value) !== -1;
        },

        getUserByToken: function getUserByToken(userToken) {
            if (!userToken) {
                return null;
            }


        }
    };

    function getMoves(position) {
        return moveRepo.getMovesFromPosition(position._key);
    }

    function getGames(position) {
        // TODO
        return [];
    }

    function getAdditionalData(req, positions) {
        if (!Array.isArray(positions)) {
            return getAdditionalData(req, [positions])[0];
        }

        var transforms = [];
        if (helpers.isTruthy(req.params('withMoves'))) {
            transforms.push(['moves', getMoves]);
        }
        if (helpers.isTruty(req.params('withGames'))) {
            transforms.push(['games', getGames]);
        }

        if (transforms.length) {
            transforms.forEach(function(transform){
                position[transform[0]] = transform[1](position);
            });
            return positions;
        }

        return positions;
    }

    /**
     * Get all the positions
     */
    controller.get('/', function(req, res){
        var results = positionRepo.all(getOptions(req));
        results = getAdditionalData(req, results);
        res.json(results);
    });

    /**
     * Get the starting position
     */
    controller.get('/start', function(req, res){
        var result = positionRepo.firstExample({fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'});
        result = getAdditionalData(req, result);
        res.json(result);
    });

    /**
     * Get a position by fen string
     */
    controller.get('/fen/:fen', function (req, res){
        var result = positionRepo.firstExample({fen: req.params('fen')});
        if (!result) {
            res.status(404);
        } else {
            result = getAdditionalData(req, result);
        }

        res.json(result);
    });

    /**
     * Get a position by id
     */
    controller.get('/:id', function (req, res){
        var result = positionRepo.byId(req.params('id'));
        if (!result) {
            res.status(404);
        } else {
            result = getAdditionalData(req, result);
        }

        res.json(result);
    });

    /**
     * Create a position
     */
    controller.post('/', function (req, res) {
        var body = req.body();
        var user = helpers.getOptions(body.token);
        var fen = body.fen;
        var advantage = body.advantage || 'undetermined';
        if (!user) {
            res.status(401);
            return res.json({error: 'Invalid or missing token'});
        }

        if (!user.isAdmin() && advantage != 'undetermined') {
            advantage = 'undetermined'
        }

        var position = new PositionModel({
            fen: fen,
            advantage: advantage
        });

        position = PositionRepo.save(position);

        res.json(position);

    });

    /**
     * Replace an existing position
     */
    controller.put('/:id', function (req, res) {
        var body = req.body();
        var user = helpers.getOptions(body.token);
        var fen = body.fen;
        var advantage = body.advantage || 'undetermined';

        if (!user) {
            res.status(401);
            return res.json({error: 'Invalid or missing token'});
        }

        if (!user.isAdmin()) {
            res.status(401);
            return res.json({error: 'Permission denied'});
        }

        var position = PositionRepo.byId(req.params('id'));

        if (!position) {
            res.status(404);
            res.json({error: 'Position not found'});
        }

        position.set('fen', body.fen);
        position.set('advantage', body.advantage || 'undetermined');

        position = PositionRepo.replace(position);

        res.json(position);
    });

    /**
     * Update an existing position
     */
    controller.put('/:id', function (req, res) {
        var body = req.body();
        var user = helpers.getOptions(body.token);
        var fen = body.fen;
        var advantage = body.advantage || 'undetermined';

        if (!user) {
            res.status(401);
            return res.json({error: 'Invalid or missing token'});
        }

        if (!user.isAdmin()) {
            res.status(401);
            return res.json({error: 'Permission denied'});
        }

        var position = PositionRepo.byId(req.params('id'));

        if (!position) {
            res.status(404);
            res.json({error: 'Position not found'});
        }

        position.set('fen', body.fen || position.get('fen'));
        position.set('advantage', body.advantage || position.get('advantage'));

        position = PositionRepo.replace(position);

        res.json(position);
    });

    controller.delete('/:id', function(req, res) {
        var user = helpers.getOptions(body.token);
        if (!user) {
            res.status(401);
            return res.json({error: 'Invalid or missing token'});
        }

        if (!user.isAdmin()) {
            res.status(401);
            return res.json({error: 'Permission denied'});
        }

        var position = PositionRepo.byId(req.params('id'));

        if (!position) {
            res.status(404);
            res.json({error: 'Position not found'});
        }

        PositionRepo.remove(position);

        res.json({status: 'OK'});

    });

})();