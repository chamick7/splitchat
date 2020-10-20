const mongoose = require('mongoose');


const chatSchema = mongoose.Schema({

    chatID:mongoose.Schema.Types.ObjectId,
    msg: { type: String, required: true },
    sender: { type:String, required: true },
    senderID: { type:String, required: true },
    activity: { type: String, required: true },
    activityID: { type: String, required: true },
    DateTime: { type: Date,default: Date.now },
    
})



module.exports = mongoose.model('Chat',chatSchema);