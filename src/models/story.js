const mongoose = require('mongoose')
const Snippet = require('./snippet')

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

storySchema.virtual('snippets', {
    ref: 'Snippet',
    localField: '_id',
    foreignField: 'story'
})

storySchema.pre('remove', async function (next) {
    const story = this
    await Snippet.deleteMany({ story: story._id }) // CASCADE delete Snippets from story

    next()
})

const Story = mongoose.model('Story', storySchema)

module.exports = Story