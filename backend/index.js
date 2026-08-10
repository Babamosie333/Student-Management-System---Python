const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config();

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '10mb' }))
app.use(cors())

if (!process.env.MONGO_URL) {
    console.error(
        "MONGO_URL is not set. Create a backend/.env file (see backend/.env.example) " +
        "or set MONGO_URL in your Vercel project's Environment Variables."
    )
} else {
    mongoose
        .connect(process.env.MONGO_URL, {
            // Fail fast instead of hanging: if Mongo can't be reached, queries
            // throw within a few seconds instead of the request/spinner hanging
            // forever waiting for a connection that never comes.
            serverSelectionTimeoutMS: 8000,
        })
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))
}

// If Mongo is down/unreachable, don't let queries queue up silently forever —
// make them fail after a few seconds instead of hanging.
mongoose.set('bufferTimeoutMS', 8000);

// All backend routes are mounted under /api so the app can be deployed
// as a single Vercel project alongside the frontend (see /vercel.json).
app.use('/api', Routes);

app.get('/api', (req, res) => {
    res.send('API is running')
})

// Only start a standalone listener when run directly (local dev / traditional
// hosting). On Vercel, the exported `app` is used as a serverless function.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started at port no. ${PORT}`)
    })
}

module.exports = app
