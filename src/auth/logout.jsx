import React from "react";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import creds from "../config";

export default function Logout(props){
    function on_success(){
        console.log("Logout successfull")
        localStorage.clear()
        props.set_views('auth')
    }
    function on_error(res){
        console.log('Logout unsuccessfull', res)
    }

    return (
        <>
            <button onClick={e=>{on_success()}}>Logout</button>
        </>
    )
}