const {Room} = require('../models')

class RoomController {

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
            'name' : data.name,
            players : {
                ['1.' + data.name] : 0
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

    static deleteRoom(roomName,cb){
        
        Room
            .destroy({where : {name : roomName}})
            .then(results => {
                cb(null)
            })
            .catch(err => {
                cb()
            })
    }

    static joinRoom(roomName,cb){

    }
}

module.exports = RoomController