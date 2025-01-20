import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import RegisterAndLoginForm from '../components/RegisterAndLoginForm';
import axios from 'axios';
import Chat from '../components/Chat';

export default function Routes() {
	const { username, setLoggedUsername, id, setId } = useContext(UserContext);

	useEffect(() => {
		axios.get('/profile').then((res) => {
			setId(res.data.userId);
			setLoggedUsername(res.data.username);
		}).catch((err) => {
			console.error(err);
		});
	}, []);

	if (username) {
		return <Chat/>;
	}

	return <RegisterAndLoginForm />;
}
