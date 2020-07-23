const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const storyRouter = require('./routers/story')
const snippetRouter = require('./routers/snippet')

const app = express()
const port = 3000

app.use(express.json())

app.use(userRouter)
app.use(snippetRouter)
app.use(storyRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})