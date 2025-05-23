import express, { json } from 'express';
const app = express();
import path, {dirname, join } from 'path';
import { fileURLToPath } from 'url';
import tasksRoutes from './routes/tasksRoute.js';
import userRoutes from './routes/userRoute.js';
import connectDB from './config/db.js';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB()

app.use(express.static(join(__dirname, 'public')))
app.use(json()) // handles incomming JSON data

app.use(cors())

/* app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
}); */

app.use('/users', userRoutes)
app.use('/', tasksRoutes)

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "app.html"))
})

// Port to be used, will be handled in .env
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})