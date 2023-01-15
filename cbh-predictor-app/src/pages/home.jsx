import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth.service"

const HomeScreen = () => {
    const user = authService.getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    return(
        <h1>
            Home Screen
        </h1>
    )
}

export default HomeScreen