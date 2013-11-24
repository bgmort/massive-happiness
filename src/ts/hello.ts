interface Thing {
	do(command:string, ...args:any[]):any;
}

var Hello = {
	do: function(command:string, message:string){
		switch (command){
			case 'scream':
				message = message.toUpperCase();
			case 'say':
				console.log(message);
				break;
			default:
				console.log('unrecognized command "' + command + '"');
		}
	}
}