const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { update } = require('../models/user')

const router = new express.Router()

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.send(500).send()
    }
})

router.get('/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username} )

        if (!user) {
            throw new Error()
        }

        await user
            .populate({
                path: 'stories',
            })
            .populate({
                path: 'snippets'
            })
            .execPopulate()

        res.send({ user, stories: user.stories, snippets: user.snippets })
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ })
        res.send(users)
    } catch (e) {
        res.status(404).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(`Parameters you want to update : ${updates}`)
    const allowedUpdates = ['username', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
 })



module.exports = router

