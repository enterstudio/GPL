/*
 *  GraVITas Premier League <gravitaspremierleague@gmail.com>
 *  Copyright (C) 2014  IEEE Computer Society - VIT Student Chapter <ieeecs@vit.ac.in>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var collection;
var path = require('path');
var async = require('async');
var mongoUsers = require(path.join(__dirname, 'mongo-users'));
var mongoFeatures = require(path.join(__dirname, 'mongo-features'));
var mongoInterest = require(path.join(__dirname, 'mongo-interest'));
var match = require(path.join(__dirname, '..', 'schedule', 'matchCollection.js'));

require('./database')(function(err, db){
    if(err)
    {
        throw err;
    }
    else
    {
        var getPlayer = function (id, callback)
        {
            db.collection('players').findOne({_id: id}, callback);
        };

        exports.getTeam = function (doc, callback)
        {
            collection = db.collection(match);   // match collection
            var onFetch = function (err, document)
            {
                console.log("Length " + document.team.length);
                if (document.team.length == 0)
                {
                    console.log("Reached");
                    callback(null, []);
                }
                else if (err)
                {
                    callback(err, null);
                }
                else
                {
                    async.map(document.team, getPlayer, callback);
                }
            };
            collection.findOne(doc, onFetch);
        };

        exports.getSquad = function (doc, callback)
        {
            var coach;
            collection = db.collection(match); // match collection
            var onFinish = function (err, documents)
            {
                var onGetCoach = function (err, doc)
                {
                    if (err)
                    {
                        console.log(err.message);
                        callback(err, null)
                    }
                    else
                    {
                        documents.push(doc);
                        callback(null, documents);
                    }
                };
                if (err)
                {
                    throw err;
                }
                else
                {
                    getPlayer(coach, onGetCoach);
                }
            };

            var onFetch = function (err, document)
            {
                if (document)
                {
                    if (err)
                    {
                        callback(err, null);
                    }
                    else if (document.team.length != 0)
                    {
                        for (var i = 0; i < 16; i++) {
                            if (document.team[i] >= 'd1')
                            {
                                coach = parseInt(document.team[i]);
                            }
                        }
                        async.map(document.squad, getPlayer, onFinish);
                    }
                    else
                    {
                        callback(null, []);
                    }
                }
                else
                {
                    callback(null, []);
                }
            };
            console.log("Team " + doc.team_no);
            collection.findOne(doc, onFetch);
        };

        exports.dashboard = function (doc, callback)
        {
            var slice =
                {
                    dob: 0,
                    team_no : 0,
                    password_hash : 0,
                    stats : 0,
                    email: 0,
                    phone: 0,
                    squad: 0,
                    team: 0,
                    manager_name: 0,
                    authStrategy: 0,
                    surplus: 0
                };
            db.collection(match).findOne(doc, slice, callback);
        };

        exports.map = function (doc, callback)
        {
            collection = db.collection(match);
            var onFind = function (err, doc)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, doc.team_no);
                }
            };
            collection.findOne(doc, {team_no: 1}, onFind);
        };

        exports.shortList = function (callback) // TODO: add email notification for shortlisted team owners.
        {
            var ref =
            {
                'users' :
                {
                    out : 'round2',
                    limit : parseInt(process.env.ONE)
                },
                'round2' :
                {
                    out : 'round3',
                    limit : 8
                },
                'round3' :
                {
                    out : null,
                    limit : 8
                }
            };
            var onShortList = function (err, docs)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    console.log('-', docs);
                    for(i = 0; i < docs.length; ++i)
                    {
                        docs[i].team_no = i + 1;
                    }
                    db.collection(ref[match].out).insertMany(docs, callback);
                }
            };
            db.collection(match).aggregate([{
                $sort :
                {
                    points : -1,
                    net_run_rate : -1,
                    win : -1,
                    loss : 1
                }
            },
                {
                    $limit : ref[match].limit
                }
            ], onShortList);
        };

        exports.adminInfo = function (callback)
        {
            var onParallel = function (err, result)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, result);
                }
            };

            var parallelTasks =
            {
                interest: function (asyncCallback)
                {
                    mongoInterest.quantify(asyncCallback);
                },
                total: function (asyncCallback)
                {
                    mongoUsers.getCount({}, asyncCallback);
                },
                facebook: function (asyncCallback)
                {
                    mongoUsers.getCount({authStrategy: 'facebook'}, asyncCallback);
                },
                google: function (asyncCallback)
                {
                    mongoUsers.getCount({authStrategy: 'google'}, asyncCallback);
                },
                twitter: function (asyncCallback)
                {
                    mongoUsers.getCount({authStrategy: 'twitter'}, asyncCallback);
                },
                local: function (asyncCallback)
                {
                    mongoUsers.getCount({authStrategy: 'local'}, asyncCallback);
                },
                emptySquad: function (asyncCallback)
                {
                    mongoUsers.getCount({squad: []}, asyncCallback);
                },
                emptyTeam: function (asyncCallback)
                {
                    mongoUsers.getCount({team: []}, asyncCallback);
                },
                features: function (asyncCallback)
                {
                    mongoFeatures.notify(asyncCallback);
                },
                forgot: function (asyncCallback)
                {
                    mongoFeatures.forgotCount({password : 0}, asyncCallback);
                }
            };
            async.parallel(parallelTasks, onParallel);
        };

        exports.fetchMatches = function (team, callback)
        {
            var parallelTasks =
            [
                function (asyncCallback)
                {
                    mongoFeatures.match(1, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(2, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(3, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(4, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(5, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(6, team, asyncCallback);
                },
                function (asyncCallback)
                {
                    mongoFeatures.match(7, team, asyncCallback);
                }
            ];
            async.parallel(parallelTasks, callback);
        };

        exports.check = function (team, callback)
        {
            collection = db.collection('users');
            var onFind = function (err, result)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, result ? false : true);
                }
            };
            collection.findOne(team, onFind);
        };

        exports.opponent = function (day, team, callback)
        {
            collection = db.collection('matchday' + day);
            var filter =
                {
                    $or:
                        [
                            {
                                Team_1: team
                            },
                            {
                                Team_2: team
                            }
                        ]
                };
            var onFind = function (err, doc)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, (team == doc.Team_1) ? doc.Team_2 : doc.Team_1);
                }
            };
            collection.findOne(filter, onFind);
        };

        var player = function (id, callback)
        {
            db.collection('players').findOne({_id: id}, {Name: 1, Country: 1, Type: 1}, callback);
        };

        exports.squad = function (doc, callback)
        {
            collection = db.collection(match);
            var onSquad = function (err, doc)
            {
                doc.team.sort();
                if (err)
                {
                    callback(err);
                }
                else
                {
                    var onGet = function (err, results)
                    {
                        doc.team = results;
                        callback(null, doc);
                    };
                    async.map(doc.team, player, onGet);
                }
            };
            collection.findOne(doc, {team: 1}, onSquad);
        };
    }
});