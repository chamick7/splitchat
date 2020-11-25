const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Socket } = require("net");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;
const io = require("socket.io")(server);
const Chat = require("./db/models/chatModel");
require("dotenv").config();

mongoose
  .connect(
    "mongodb://" +
      process.env.MONGO_USERNAME +
      ":" +
      process.env.MONGO_PASSWORD +
      "@" +
      process.env.MONGO_HOST +
      "/" +
      process.env.MONGO_DB +
      "?authSource=admin",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  let allowedOrigins = ["http://localhost:3000", "https://splitact.com"];
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const insertDB = (data) => {

  const chat = Chat({
    _id: mongoose.Types.ObjectId(),
    msg: data.msg,
    sender: data.sender,
    senderID: data.senderID,
    activityID: data.activity,
    time: data.time
  });

  chat
    .save()
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

io.on("connection", (socket) => {
  //[ array of atID ]
  socket.on("join", (data) => {
    console.log("join " + data);
    socket.join(data);
  });

  socket.on("msgToServer", (data) => {
    data.time = Date();
    console.log(data);
    io.to(data.activity).emit("msgToClient", data);
    insertDB(data);
  });
});

app.get("/getchatmore", (req,res,next) => {
  const activity = req.query.activity;
  const begin = req.query.begin;

  
})

app.get("/getchat", (req, res, next) => {

  const activity = req.query.activity
  console.log(activity);
  Chat.find({ activityID: activity })
    .select("-_id")
    .sort("-time")
    .limit(10)
    .then((chat) => {
      res.status(200).json({
        status: "Success",
        msg: chat.reverse(),
      });
    });
});

server.listen(port, () => {
  console.log("Server started at port " + port);
});
