import AuthVerify from "../services/authVerify"
import { useNavigate } from "react-router-dom"

const HomeScreen = () => {
    const navigate = useNavigate()
    if(!AuthVerify()) navigate("/login")
    console.log(AuthVerify())

    return(
        <h1>
            Home Screen
        </h1>
    )
}

export default HomeScreen