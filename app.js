const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const fs = require('fs')
const userdata = JSON.parse(fs.readFileSync('user.json','utf8'))
let round = JSON.parse(fs.readFileSync('round.txt','utf8'))
io.on('connection', (socket)=>{
  console.log('a user connected')

  io.emit('result-login', userdata)
  io.emit('rounds', round)

  socket.on('login', (data) => {
    let newdata = userdata
    if (newdata.length == 0) {
      let generateuser = {
          id: newdata.length+1,
          name: data.name,
          pos: data.pos,
          img: data.img
        }
      newdata.push(generateuser)
    } else {
      for (user in newdata) {
        if (user.name !== data.name) {
          let generateuser = {
            id: newdata.length+1,
            name: data.name,
            pos: data.pos,
            img: data.img
          }
          newdata.push(generateuser)
        }
      }
    }
    fs.writeFileSync('user.json', JSON.stringify(newdata, null, 2))
    newdata.forEach(el=>{
      if(el.name == data.name) {
        socket.emit('generate-token', {id: el.id, name: el.name})
      }
    })
    io.emit('result-login', newdata)
  })

  socket.on('movement', data => {
    // console.log(data);
    fs.writeFileSync('user.json', JSON.stringify(data, null, 2))
    io.emit('result-login', data)
  })

  socket.on('finish', data => {
    fs.unlinkSync('user.json')
    fs.writeFileSync('user.json','[]')
    io.emit('finish-msg', data)
    console.log('kereset');
  })

  socket.on('delete', data => {
    fs.unlinkSync('user.json')
    fs.writeFileSync('user.json','[]')
  })

  socket.on('round', data => {
    console.log(data);
    round = data
    fs.writeFileSync('round.txt', round)
    io.emit('rounds', round)
  })

})

http.listen(PORT,()=>{
  console.log(PORT);
})

