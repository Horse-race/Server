const {Room} = require('../models')
// const kue = require('kue')
// const queue = kue.createQueue()

class RoomController {

    // TAMPILKAN LIST ROOM
    static roomList(cb){
        Room
            .findAll()
            .then(results => {
                cb(null,results)
            })
            .catch(err => {
                cb(err)
            })
    }


    //untuk buat room
    static createRoom(data,cb){
        console.log(data.name)

        let newRoom = {
            'name' : data.name, //nama room
            players : {
                ['1.' + data.playerName] : 0 // list pemain
            }
        }

        Room
            .create(newRoom)
            .then(results => {
                // console.log(results.dataValues)
                cb(null, results.dataValues)
            })
            .catch( err => {
                console.log(err.message)
                cb(err)
            })
    }

    // leave room
    static leaveRoom(payload,cb){
        console.log('delete??')
        Room
            .destroy({where : {name : payload.roomName}})
            .then(results => {
                console.log('room has deleted')
                cb(null)
            })
            .catch(err => {
                console.log(err)
                cb()
            })
    }

    //join room
    static joinRoom(roomName,cb){

    }

}

module.exports = RoomController