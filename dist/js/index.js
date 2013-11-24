var newGuy = {name:'The new guy', id:-1, info: 'This guy was rendered client side! Using, of course, the same template as Fred and Joe.'};

$('#addmore').click(function(){
	dust.render('views/partials/user-badge.dust', newGuy, function(err, html){
		$('#users').append('<li>' + (err ? 'error! ' + err.message : html) + '</li>')
	});
});
