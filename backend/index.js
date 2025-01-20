const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const cors = require('cors');
const ws = require('ws')
const bycrptSalt = bcrypt.genSaltSync(10)
const jwtSecret = process.env.JWT_SECRET;
console.log(process.env.FRONTEND_URL);

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URL);

app.get('/', (req, res) => {
	res.json(`Hello World`);
});

app.get('/profile', async (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, jwtSecret, {}, (err, userData) => {
			if (err) throw err;
			res.json({
				userId: userData.userId,
				username: userData.username,
			});
		});
	} else {
		res.status(401).json('no token');
	}
});

app.post('/register', async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return res.status(409).json({
			msg: 'user already exist',
		});
	}
	try {
        const hashedPassword = bcrypt.hashSync(password, bycrptSalt)
		const newUser = await User.create({ 
            username: username,
            password: hashedPassword
        });
		const token = jwt.sign(
			{
				userId: newUser._id,
				username,
			},
			jwtSecret
		);
		res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
			id: newUser._id,
			username,
		});
	} catch (error) {
		res.status(500).json({ error: 'Error registering new user' });
	}
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const foundUser = await User.findOne({ username });
    if(foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password)
        if(passOk) {
            jwt.sign({
				userId: foundUser._id,
				username,
			},
			jwtSecret,
        {}, 
    (err, token)=> {
        res.cookie('token', token).json({
            id: foundUser._id
        })
    })
        } else {
            return res.status(404).json("wrong password")
        }
    }
});

const server = app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

const wss = new ws.WebSocketServer({server})
wss.on('connection', (connection, req)=> {
	const cookies = req.headers.cookie
	if(cookies) {
		const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='))
		if(tokenCookieString) {
			const token = tokenCookieString.split('=')[1]
			if(token) {
				const {userId, username} = jwt.verify(token, jwtSecret)
				connection.userId = userId
				connection.username = username
			}
		}
	}

	[...wss.clients].forEach(client => {
		client.send(JSON.stringify({
			online: [...wss.clients].map(c => ({
				userId: c.userId,
				username: c.username
	}))
		}
		))
	})
})