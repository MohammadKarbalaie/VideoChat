const express = require('express');
const app = express()
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid')
const socketio = require('socket.io');
const io = socketio(server);

app.set('view engine','ejs');
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:id',(req,res)=>{
    res.render('room',{roomId:req.params.id});
})

 io.on("connection",socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId , userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        socket.on('disconnect',() => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    })
 })

 

server.listen(4000);