const http = require('./app')
const io = require('socket.io')(http)
const RoomController = require('./controllers/roomControllers')


io.on('connection', function(socket){

    // socket.on('testing',function(){
    //     console.log('tidur')
    // })


    // IN MENU
    console.log('bolu')
    //Buat Room
    socket.on('create-room', (data) => {
        // console.log('tidur')
        RoomController.createRoom(data, function(err,results){
            if(err){
                socket.emit('show-error', 'unable to create room')
            }else{
                io.emit('room-created', results) //send data ke room-created
                console.log(results)
                socket.join(results.name) // join room yang dibuat
                socket.emit('joining-room', {...results, playerKey: `1-${results.playerName}`, isHost : true}) 
            }
        })
    })

    //join room
    socket.on('join-room', (payload) => {
        console.log(payload)
        RoomController.joinRoom(payload, function(err, results){
            console.log('test')
            if(err){
                socket.emit('show-error', 'unable to join' + payload.roomName)
            }else {
                socket.join(payload.roomName)
            }
        })
    } )

    //show ROOM LISTs
    socket.on('get-rooms', () => {
        RoomController.roomList((err,results) => {
            if(err){
                socket.emit('show-error', 'failed read all rooms')
            }else{
                console.log(results)
                socket.emit('get-rooms', results) //mengirim data results ke get-rooms
            }
        })
    })


    // IN-GAME

    socket.on('leave-room',(payload) => {
        socket.leave(payload.roomName)
        RoomController.leaveRoom(payload, (err,results) => {
            io.to(payload.roomName).emit('player-left',results.players) //mengupdate data list player yang masih didalam room
            io.emit('update-client-room')
        })
    })

    socket.on('update-position',(payload) => {
        socket.broadcast.to(payload.roomName).emit('update-position',payload) //trigger client untuk update posisi kuda
    })

    socket.on('update-score',(payload) => {
        socket.broadcast.to(payload.roomName).emit('update-score',payload) // trigger client untuk mengupdate score
    })
})

