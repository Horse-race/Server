const {Room} = require('../models')
const kue = require('kue')
const queue = kue.createQueue({
    redis: process.env.REDIS_URL
  })
  


queue.process('join-to-room', (job,done) => {

    console.log(job.data)
    const {payload} = job.data // mengambil data dari job 

    Room
        .findOne({where : {name : payload.roomName}})
        .then(results => {
            let index = Object.keys(results.players).length  // menghitug jumlah keys dari players
            let playerKey = `${index + 1}-${payload.playerName}` // membuat data player yang akan join
            results.players[playerKey] = 0 // menambah key didalam players
            results.changed("players",true) // fungsinya untuk memastikan data berubah karena tipe data JSON

            return Promise.all([results.save(),playerKey]) // jalankan process multi promise untuk menyimpan data room dan data player yang baru masuk
        })
        .then(([results,playerKey]) => {
            console.log({...results.dataValues})
            done(null, {...results.dataValues, playerKey})
        })
        .catch(err => {
            done(err)
        })
})

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
        // console.log(data.name)

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
        
        Room
            .findOne({where : {name : payload.roomName}})
            .then(results => {
                if(results){
                    delete results.players[payload.playerKey];
                    results.changed("players", true) // untuk konfirmasi bahwa data players ada yang berubah karena data tipe JSON
                    return results.save() // save data row yang dipilih
                  } 
            })
            .then(results => {
                cb(null,results.dataValues)
            })
            .catch(err => {
                cb(err)
            })
    }

    //join room
    static joinRoom(payload,cb){
        console.log('sleep')
        var job = queue.create('join-to-room', {
            payload,
            cb
        }).save() //membuat job untuk melakukan process join room

        job.on('complete', (results) => {
            console.log('work complete on', results)
            cb(null,results) //callback dengan data results
        })
        .on('failed', (errorMessage) => {
            cb('failed')
        })
    }

    static deleteRoom(roomName,cb){
        console.log('delete??')
        Room
            .destroy({where : {name : roomName}})
            .then(results => {
                console.log('room has deleted')
                cb(null)
            })
            .catch(err => {
                console.log(err)
                cb()
            })
    }
}

module.exports = RoomController