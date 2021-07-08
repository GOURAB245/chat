const express= require('express');
const app= express();
const http= require('http').createServer(app)

const PORT= process.env.PORT || 7000

http.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})


//node server will handle the socket io
const io=require('socket.io')(http);

const users={};

//io.on will listen all the socket connections .
//socket.on will listen when a partcular connection will join the chat
 io.on('connection' , socket =>{
     socket.on('new-user-joined' , (name) =>{
        
        users[socket.id] = name;
        //to say all the users that someone has joined
        socket.broadcast.emit('user-joined' ,name);
     });
     //when some sends msg 
        socket.on('send' , message => {
      socket.broadcast.emit('receive' , {message: message , name: users[socket.id]})
       
      //when someone left the chat-app
      socket.on('disconnect' , message => {
         socket.broadcast.emit('left' , users[socket.id])
         //delete user from the array
         delete users[socket.id];
      });
   });  
 });

 