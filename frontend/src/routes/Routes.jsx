import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RegisterAndLoginForm from '../components/RegisterAndLoginForm';

export default function Routes() {
	const { username, id } = useContext(UserContext);
	console.log();

	if (username) {
		return 'Logged in ' + username;
	}

	return <RegisterAndLoginForm />;
}
