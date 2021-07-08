
//we will connect our client server to the node server
const socket= io('http://localhost:7000');
//to collect the form from chat-box by id
const form = document.getElementById('send-container');

//to collect the message from input area
const messageInput = document.getElementById('messageInp');

//to read all the chats from chat container
const messageContainer = document.querySelector(".container");

const audio=new Audio('ring.mp3');
//when someone has joined...
const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left')
    {
        audio.play();
    }
}
//when someone submitted the form i.e send any msg
form.addEventListener('submit' , (e) =>{
     e.preventDefault();
     const message = messageInput.value;
     append(`You: ${message}` , 'right');
     socket.emit('send' ,message);
     messageInput.value=''
});
//when a new user joins
 const data = prompt("enter you name to join");
socket.emit('new-user-joined', data);

//to listen an event when a user has joined
socket.on('user-joined' , username =>{
    append(`${username} joined the chat` , 'right')
});
//when the client receives some event(message)
socket.on('receive' , data =>{
    append(`${data.name} : ${data.message}` , 'left')
});

//when someone disconnected
socket.on('left' , data =>{
    append(`${data} has left the meeting` , 'left')
});
