import React from "react";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import creds from "../config";

export default function Logout(props){
    function on_success(res){
        console.log("Logout successfull",res)
        localStorage.clear()
        props.set_views('auth')
    }
    function on_error(res){
        console.log('Logout unsuccessfull', res)
    }

    return (
        <>
            <GoogleLogout
                clientId={creds.clientId}
                buttonText="Logout"
                onLogoutSuccess={on_success}
                onFailure={on_error}
            />
        </>
    )
}