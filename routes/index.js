
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.dust', { title: 'DustJS', users: require('../data/appdata').users});
};