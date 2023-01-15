import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth.service"

const NoPage = () => {
    const user = authService.getCurrentUser()
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) navigate("/login")
    },[])

    return(
        <>
            Error 404: Page not found
        </>
    )
}

export default NoPage