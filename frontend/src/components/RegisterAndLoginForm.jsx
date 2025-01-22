import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { UserContext } from '../contexts/UserContext';

const RegisterAndLoginForm = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isLoggedIn, setisLoggedIn] = useState(true)
	const {setLoggedUsername, setId } = useContext(UserContext)
	async function handleSubmit(e){
		e.preventDefault()
		const url = isLoggedIn === false ? '/register' : '/login'
		const {data} = await axios.post(url, {
				username: username,
				password: password
			})

		setLoggedUsername(username)
		setId(data.id)
	}

	return (
		<div className='bg-blue-50 h-screen flex items-center justify-center'>
			<form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
				<input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="username" className="block w-full rounded-sm mb-2 p-2 border" />
				<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" className="block w-full rounded-sm mb-2 p-2 border" />
				<button className="bg-blue-500 text-white w-full block rounded-sm p-2" type='submit'>
				{isLoggedIn === false ? 'Register' : 'Login' }
				</button>
				<div className='text-center mt-2'>
				{isLoggedIn === false ? 'Already a member? ' : 'Don"t have an account? '} <button onClick={()=> {
						setisLoggedIn(r=>!r)
						console.log(isLoggedIn)
					}} className=' text-blue-500'>{isLoggedIn === false ? 'Login' : 'Register'}</button>
				</div>
			</form>
		</div> 
	);
};

export default RegisterAndLoginForm;
