const express = require('express')
const mongoose = require('mongoose')
const Snippet = require('../models/snippet')
const Story = require('../models/story')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/snippet/:storyId', auth, async (req, res) => {
    const snippet = new Snippet({
        ...req.body,
        author: req.user._id,
        story: req.params.storyId
    })

    try {
        await snippet.save()
        res.status(201).send(snippet)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/story/snippet/:snippetId', auth, async (req, res) => {
    const snippetId = req.params.snippetId
    const user = req.user._id

    try {
        const snippet = await Snippet.findOne({ _id: snippetId })
        if (!snippet) {
            return res.status(404).send()
        }

        const story = await Story.findOne({ _id: snippet.story })

        if (snippet.author.equals(user) || story.creator.equals(user)) {
            await Snippet.findOneAndDelete({ _id: snippetId })
        }
        
        res.send(snippet)

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router