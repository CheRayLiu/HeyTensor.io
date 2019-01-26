var express  = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames =[]

server. listen(process.env.PORT || 3000);

console.log("Server Running..");
app.get("/", function(req,res){
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket){
    console.log('Socket Connected');

    socket.on('new user', function(data,callback){
        if (usernames.indexOf(data) != -1){
            callback(false);
        }else{
            if (data!=""){
                callback(true);
                socket.username = data;
                usernames.push(socket.username);
                updateUsernames();
            }
        }
    });

    //Update usernames
    function updateUsernames(){
        io.sockets.emit('usernames', usernames);
    }
    //Send Message
    socket.on('send message', function(data){
        if (data!=""){
            io.sockets.emit('new message', {msg: data,user: socket.username});
            call_chatbot(data);
        }
    });

    //Disconnect
    socket.on('disconnect',function(data){
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username),1);
        io.sockets.emit('dis msg', socket.username)
        updateUsernames();
    });
    //Calling chatbot

    function call_chatbot(req){
        var spawn =  require("child_process").spawn;
        var process = spawn('python3',["chat_bot.py",
    req //Input message
        ]);
        process.stdout.on("data", data => {
            io.sockets.emit('new message', {msg: data,user: 'Tensor'});
          });
        
    }
});