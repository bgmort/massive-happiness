// #include "src/js/newguy.js"

$('#addmore').click(function(){
	dust.render('views/partials/user-badge.dust', newGuy, function(err, html){
		$('#users').append('<li>' + (err ? 'error! ' + err.message : html) + '</li>')
	});
});
