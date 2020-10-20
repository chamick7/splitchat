const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Socket } = require("net");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const io = require("socket.io")(server);
const Chat = require("./db/models/chatModel");
require('dotenv').config();


mongoose.connect('mongodb://'+process.env.MONGO_USERNAME+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_HOST,{
 useUnifiedTopology: true ,
  useNewUrlParser: true
}).catch(err => {
  console.log(err);
}) 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const insertDB = (data) => {


    data.nameID  = 'TestNameID';
    data.activityID = 'TestActivityID';

    const chat = Chat({
    chatID: mongoose.Types.ObjectId,
    msg: data.msg,
    sender: data.name,
    senderID: data.nameID,
    activity: data.activity,
    activityID: data.activityID,
  });

  chat
    .save()
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.activity);
  });

  socket.on("msgToServer", (data) => {
    io.to(data.activity).emit("msgToClient", data);
    insertDB(data);
  });


});


app.post('/getChat',(req,res,next) => {

    const name = req.body.name
    const activity = req.body.activity

    Chat.find({activity:activity}).limit(100).sort('-DateTime').then((chat) => {

        
        res.status(200).json({
            status: "Success",
            msg: chat.msg,
        })
    })


})

server.listen(port, () => {
  console.log("Server started at port " + port);
});
