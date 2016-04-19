module.exports = function(socket) {

    function broadcast(type, payload) {
        socket.broadcast.emit(type, payload);
        // Besked til afsender også -->
        socket.emit(type, payload);
    }

    socket.on('message', function(message){
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();

        var time = h + ":" + m
        broadcast('message', time + ": " + socket.username + ": " + message);

    });

    users = [];

    socket.on('user', function (data, callback) {
        if (users.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
        }

        broadcast('message', "User connected: " + socket.username);
        broadcast('user', users);
    });



};