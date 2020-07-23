const express = require('express')
const Story = require('../models/story')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/story', auth, async (req, res) => {
    const story = new Story({
        title: req.body.title,
        creator: req.user._id
    })

    try {
        await story.save()
        res.status(201).send(story)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/story/all', async (req, res) => {
    try {
        const stories = await Story.find({})
        if (!stories) {
            return res.status(404).send()
        }

        res.send(stories)
    } catch (e) {
        console.log("Error here")
        res.status(500).send(e)
    }
})

router.delete('/story/:storyId', auth, async (req, res) => {
    const _id = req.params.storyId
    try {
        const story = await Story.findOneAndDelete({ _id, creator: req.user._id })
        if (!story) {
            return res.status(404).send()
        }

        res.send(story)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/story/:storyId', async (req, res) => {
    const _id = req.params.storyId
    try {
        const story = await Story.findOne({ _id })
        if (!story) {
            return res.status(404).send()
        }

        await story.populate({ path: 'snippets' }).execPopulate()
        res.send({ story, snippets: story.snippets })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router