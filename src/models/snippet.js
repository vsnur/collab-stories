const mongoose = require('mongoose')
const Story = require('./story')

const snippetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Story'
    }
})

const Snippet = mongoose.model('Snippet', snippetSchema)

module.exports = Snippet