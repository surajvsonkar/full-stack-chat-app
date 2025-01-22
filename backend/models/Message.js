const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    text: String
}, {timestamps: true})

const MessageModel = mongoose.model('Message', messageSchema)

module.exports = MessageModel