import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Register from "../components/Register";

export default function Routes() {
    const {username, id} = useContext(UserContext)
    console.log(username)

    if(username){
        return 'Logged in ' + username
    }

    return (
        <Register/>
    )
}