
/*
 * GET users listing.
 */

var appdata = require('../data/appdata')

exports.list = function(req, res){
	res.send(appdata.users);
};