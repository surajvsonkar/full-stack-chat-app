import axios from 'axios'
import Register from './components/Register'

function App() {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true

  return (
    <>
      <Register />
    </>
  )
}

export default App
