import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { UserContext } from '../contexts/UserContext';

const Register = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const {setLoggedUsername, setId } = useContext(UserContext)
	async function register(e){
		e.preventDefault()
		const {data} = await axios.post('/register', {
				username: username,
				password: password
			})

		setLoggedUsername(username)
		setId(data.id)
	}

	return (
		<div className='bg-blue-50 h-screen flex items-center justify-center'>
			<form className="w-64 mx-auto mb-12" onSubmit={register}>
				<input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="username" className="block w-full rounded-sm mb-2 p-2 border" />
				<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" className="block w-full rounded-sm mb-2 p-2 border" />
				<button className="bg-blue-500 text-white w-full block rounded-sm p-2" type='submit'>Register</button>
			</form>
		</div> 
	);
};

export default Register;
