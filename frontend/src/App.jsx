import axios from 'axios';
import Register from './components/RegisterAndLoginForm';
import { UserContext, UserContextProvider } from './contexts/UserContext';
import { useContext } from 'react';
import Routes from './routes/Routes';

function App() {
	axios.defaults.baseURL = 'http://localhost:3000';
	axios.defaults.withCredentials = true;
	return (
		<>
			<UserContextProvider>
				<Routes />
			</UserContextProvider>
		</>
	);
}

export default App;
