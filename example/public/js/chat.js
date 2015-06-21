/* Just jquery for now - no use of angular on this example. */
var rooms = []; //or conversations


function joinConversation(room){
    rooms.push(room);

    appendConversation(room);
}

function appendConversation(room){
    $("#conversationsArea").append("<li>"+room+"</li>");
}

function appendUser(user){
    $("#usersArea").append("<li>"+user+"</li>");    
}



function appendMessage(data){
    $("#messagesArea").append("<br/>("+data.room+") <b>"+data.user+ " :</b> "+data.message); 
}

function clearConversations(){
    $("#conversationsArea").html("");   
    rooms = [];
}

function clearUsers(){
    $("#usersArea").html("");   
}


function clearMessages(){
    $("#messagesArea").html("");
}



$(document).ready(function(){
    var root = io();
    var chat;

    //On line 1050 a loc.hostname is used instead of loc.host.
    //This causes a hostname to be used when passing in a namespace, this doesn't include port number so a temp fix is: 
    var chatURI=':8080/chat'; 
    /* or

     var myId = 'kataras'; // this can be asked by server too for authorization
     var chat = io(':8080/chat?id='+myId); 

     this means all sockets is one user with id=kataras rathen than the default which is session id, you can ask for username from client and start 
     connection to io with same user    and sockets from different machine-pcs too! 

     Real web application example from above explaination: */ 
    if(Cookies.get('id') !== undefined){
        chatURI+='?id='+Cookies.get('id');
    }else{
        var explainStr = "You can pass same name if you want to test it between other machine. All same user's sockets will be synchronized!";
        var person = prompt("Please enter your name", explainStr);

        if (person !== null && person.length>0 && person!==explainStr) {
            chatURI+='?id='+person; 
            Cookies.set('id',person);
            setTimeout(function() {  root.emit('message',person+' is here!');},1000);
        }
    }

    chat = io(chatURI); 

    /*End real web application example*/

    chat.on('connect',function(){
        console.log('Connected to server.');
    });

    chat.on('set username',function(username){
        console.log('Your username is: '+username);
        //  window.alert('Your username setted by server is: '+username);

    });

    chat.on('conversation push',function(_conversations){
        console.log('-----GET----');
        if(_conversations.length ===0){
            clearMessages();
            clearConversations();
            clearUsers();
            console.log('clear conversations');
        }
        console.log('Received ' + _conversations.length+ ' conversations ');
        for(var i=0;i< _conversations.length;i++){
            joinConversation(_conversations[i].room);
            console.log('join to '+ _conversations[i].room);
            for(var j=0; j < _conversations[i].users.length; j++){
                appendUser(_conversations[i].users[j]);
                console.log('inside user: ' + _conversations[i].users[j]);

            }
            for(var k=0;k< _conversations[i].messages.length;k++){
                $("#messagesArea").append("<br/>("+_conversations[i].room+") <b>"+_conversations[i].messages[k].user+ " :</b> "+_conversations[i].messages[k].message); 
            }
        }
    });

    chat.on('conversation added',function(roomName){
        joinConversation(roomName);
    });



    chat.on('conversation user added',function(data){
        //data = room, user  
        appendUser(data.user);
    });

    chat.on('conversation message added',function(data){
        appendMessage(data);
    });


    $("#sendMessageBtn").click(function(){
        var msg = $("#messageTxt").val();
        console.dir(rooms);
        var data = {
            room:rooms[0],
            message: msg
        };

        chat.emit('conversation message',data);
        console.log('sending message to '+data.room);
        $("#messageTxt").val("");
    });


    $("#joinConversationBtn").click(function(){
        var roomName = $("#joinConversationTxt").val();

        if(rooms.indexOf(roomName)!==-1){
            window.alert('You are already in this Room!');

        }else{
            chat.emit('conversation join', roomName);
            console.log('Emit join to: ' +roomName);

            // on emit  joinConversation(roomName);
            $("#joinConversationTxt").val("");}
    });

});