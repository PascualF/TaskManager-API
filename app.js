const express = require('express')
const app = express();
const path = require('path')
const tasksRoutes = require('./routes/tasksRoute.js')
const userRoutes = require('./routes/userRoute.js')
const connectDB = require('./config/db.js')

connectDB()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json()) // handles incomming JSON data

app.use('/', tasksRoutes)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "app.html"))
})
// Port to be used, will be handled in .env
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})