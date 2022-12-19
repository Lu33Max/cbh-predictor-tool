import { useState } from "react"
import TableScreen from "./tableScreen"
import LogInForm from "./loginScreen/loginForm"
import Sidebar from "./sidebar"

const Screens = () => {
    const [showLogin, setShowLogin] = useState(true)

    return(
        <div>
            {(showLogin === true) && (
                <LogInForm onLogin={onLogin}/>
            )}
            {(showLogin === false) && (
                <>
                    {/*<Sidebar/>*/}
                    <TableScreen/>
                </>
            )}
        </div>
    )

    function onLogin(login){
        if (login === true){
          setShowLogin(false)
        } else {
          alert('Wrong Email or password. Try again.')
        }     
    }
}

export default Screens