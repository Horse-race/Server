const http = require('./app')
const io = require('socket.io')(http)
const RoomController = require('./controllers/roomControllers')


io.on('connection', function(socket){

    socket.on('testing',function(){
        console.log('tidur')
    })

    console.log('bolu')
    //Buat Room
    socket.on('create-room', (data) => {
        console.log('tidur')
        RoomController.createRoom(data, function(err,results){
            if(err){
                socket.emit('show-error', 'unable to create room')
            }else{
                io.emit('room-created', results)
                console.log(results)
                socket.join(results.name)
                socket.emit('joining-room', {...results, playerKey: `1-${results.name}`, isHost : true})
            }
        })
    })

    //join room
    socket.on('join-room', (roomDate) => {
        RoomController.joinRoom(roomData, function(err, result){
            if(err){
                socket.emit('display-error', 'unable to join' + result.roomName)
            }else {
                socket.join()
            }
        })
    } )

})

