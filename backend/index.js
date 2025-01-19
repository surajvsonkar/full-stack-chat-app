const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const jwtSecret = process.env.JWT_SECRET

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json()); // Fix: add parentheses to call express.json()
mongoose.connect(process.env.MONGO_URL)


app.get('/', (req, res) => {
    res.json(`Hello World`)
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await User.create({ username, password });
        const token = jwt.sign({
            userId: newUser._id
        },jwtSecret )
        res.cookie('token', token)
        res.status(201).json({
            token,
            newUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
