const socket= io('http://localhost:8000');

// get DOM elements in respective js variables
const form = document.getElementById('send-container');
const msgInput= document.getElementById('msgip');
const msgContainer= document.querySelector(".container");
var audio= new Audio('chat music.mp3');

// this function appends event info to the container
const append = (message, position)=>{
    const msgElement = document.createElement("div"); 
    msgElement.innerText = message;
    msgElement.classList.add('msg');
    msgElement.classList.add(position);
    
    msgContainer.append(msgElement);
    if(position== 'left'){
        audio.play();
    }
}



// ask new user for name and let the server know
const name_person= prompt('Enter your name to join the chat');
if(name_person){
    socket.emit('new-user-joined', name_person);
}

// if new user joins, receive event from the server
socket.on('user-joined', name_person=>{
    append(`${name_person} joined the chat`, 'left');
});

// if server sends the msg, receive it
socket.on('receive', data =>{
    append(`${data.name_person}: ${data.message}`, 'left');
});

// if user leaves the chat, append info to the container
socket.on('left', name_person=>{
    append(`${name_person} left the chat`, 'left');
});

// if form submitted, send server the msg
form.addEventListener('submit', (e)=>{   
    e.preventDefault();         // page vaare ghadi reload nai thai
    const message= msgInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    msgInput.value= '';
});