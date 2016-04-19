angular.module('chat', [])

    .factory('socket', function ($rootScope) {
        // See: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
        // for further details about this wrapper
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })

    .controller('mainController', function(socket){
        var scope = this;

        scope.messages = [];
        scope.users = [];

        scope.sendMessage = function() {
            socket.emit('message', scope.messageInput);
            scope.messageInput = '';
        };

        scope.submitUser = function() {
            socket.emit('user', scope.username);
            scope.username = '';
        };

        socket.on('message', function(message){
            scope.messages.push({
                body: message
            });
            console.log(message);
        });

        socket.on('user', function(user){
            scope.users.push({
                body: user
            });
            console.log(user);
        });
    });