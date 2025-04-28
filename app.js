const express = require('express')
const app = express();
const tasksRoutes = require('./routes/tasks.js')
const connectDB = require('./config/db.js')

connectDB()

app.use(express.json()) // handles incomming JSON data

app.use('/', tasksRoutes)

app.get("/", (req, res) => {
    res.send('Hello world')
})


// Port to be used, will be handled in .env
const port = 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})