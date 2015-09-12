# socket.io.users

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nodets/socket.io.users?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

This is a node js module for socket.io applications. This module finds and manages which socket is from who and visa versa.
One user per person. User means: Unlimited (new) browser tabs/windows but same machine. OR client can pass custom authorized id and have one user with it's sockets per group of different machines.
Make use of the middleware.


## Installation

```sh
$ npm install socket.io.users
```
[NPM] https://www.npmjs.com/package/socket.io.users

## Live Example (Greek language)

Go to http://chat.ideopod.com
## Usage

```js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketUsers = require('socket.io.users');

socketUsers.Session(app);//IMPORTANT

var rootIo = require('socket.io')(server); //default '/' as namespace.
var chatIo = rootIo.of('/chat');


var rootUsers = socketUsers.Users; /* default '/' as namespace. Each namespace has IT's OWN users object list,
but the Id of a user of any other namespace may has the same value if request comes from the same client-machine-user.
This makes easy to keep a kind of synchronization between all users of all different namespaces. */

var chatUsers = socketUsers.Users.of('/chat'); //


rootIo.use(socketUsers.Middleware());//IMPORTANT but no errors if you want to skip it for a io.of(namespace) that you don't want the socket.io.users' support.

chatUsers.use(socketUsers.Middleware());

chatUsers.on('connected',function(user){
    console.log(user.id + ' has connected to the CHAT');
    user.set('username', 'username setted by server side'); /*at the store property you can store any type of properties
    and objects you want to share between your user's sockets. */
    user.socket.on('any event', function(data){ //user.socket is the current socket, to get all connected sockets from this user, use: user.sockets

    });
    chatIo.emit('set username',user.get('username')); //or user.store.username
});

rootUsers.on('connected',function(user){
    console.log('User has connected with ID: '+ user.id);
});



rootUsers.on('connection',function(user){
    console.log('Socket ID: '+user.socket.id+' is user with ID: '+user.id);
});

rootUsers.on('disconnected',function(user){
    console.log('User with ID: '+user.id+'is gone away :(');
});



//You can still use the io.on events, but the execution is after connected and connection of the 'users' and 'chatUsers', no matter the order.
rootIo.on('connection',function(socket){
    console.log('IO DEBUG: Socket '+ socket.id+ ' is ready \n');
});


```

## Look at the Example folder for a complete example using: Server side: express js,socket.io,socket.io.users. Client side: AngularJS,socket.io,bootstrap,jquery.


### [GPL-3.0 Licensed](LICENSE)

[downloads-url]: https://www.npmjs.com/package/socket.io.users
