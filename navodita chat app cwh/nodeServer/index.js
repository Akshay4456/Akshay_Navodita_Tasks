// node server
const io= require('socket.io')(8000,{
        cors: {
            origin: '*',
        }
})

const users= {}
 
io.on('connection', socket=>{
    // if new user joins, other  users will notify
    socket.on('new-user-joined', name_person=>{
        console.log("user:", name_person);
        users[socket.id]=name_person;
        socket.broadcast.emit('user-joined', name_person);
    });

    // if someone sends the msg, broadcast to other people
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name_person: users[socket.id]})
    });

    // if someone leaves the chat......
    // disconnect is builtin event others 2 are user defined
    socket.on('disconnect', message=>{                              
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})