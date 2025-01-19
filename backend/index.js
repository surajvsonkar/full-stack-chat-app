const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const jwtSecret = process.env.JWT_SECRET
console.log(process.env.FRONTEND_URL)

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
mongoose.connect(process.env.MONGO_URL)


app.get('/', (req, res) => {
    res.json(`Hello World`)
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = User.find({username})
    if(existingUser) {
        return res.status(409).json({
            msg: "user already exist"
        })
        
    }
    try {
        const newUser = await User.create({ username, password });
        const token = jwt.sign({
            userId: newUser._id
        },jwtSecret )
        res.cookie('token', token).status(201).json({
            _id: newUser._id
        })
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
