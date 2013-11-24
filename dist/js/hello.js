var Hello = {
    do: function (command, message) {
        switch (command) {
            case 'scream':
                message = message.toUpperCase();
            case 'say':
                console.log(message);
                break;
            default:
                console.log('unrecognized command "' + command + '"');
        }
    }
};
//# sourceMappingURL=hello.js.map
