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

var scaleRef =
{
    'KB': 1024,
    'MB': 1048576
};
var forgotRef =
{
    user:
    {
        user: 1
    },
    password:
    {
        password:1
    }
};
var path = require('path').join;
if(!process.env.NODE_ENV)
{
    var value = require('faker').commerce.price;
}
var mongoFeatures = require(path(__dirname, 'mongoFeatures'));

exports.scale = function(value, level)
{
    return (value / scaleRef[level]).toFixed(2) + level;
};

exports.parse = function(mode, lower, upper)
{
    return Number[`parse${mode}`]((value() % (upper - lower + 1) + lower).toFixed(2), 10);
};

exports.forgotCallback = function(mode, callback)
{
    return function(err)
    {
        if(err)
        {
            return callback(err);
        }

        mongoFeatures.forgotCount(forgotRef[mode], callback);
    }
};
