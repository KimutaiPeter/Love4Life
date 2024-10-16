import React from "react";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import creds from "../config";
import firebase_functions from "../firebase/activities";

creds.clientId
export default function Login(props) {

    async function onSuccess(res){
        console.log('Login Successfull',res)
        localStorage.setItem("profile",JSON.stringify(res.profileObj))
        //Check if the database has these details
        var data= await firebase_functions.read_data(res.profileObj.email)
        console.log(data)
        if (data!=null){
            //Load the data into local storage: 
            var file_id=data.docs.google_sheet.id
            localStorage.setItem('file_id',file_id)
            //if yes show the app page 
            console.log("Showing the main app")
            props.set_views('main')

        }else{
            //if not:
            //Store details locally and on firebase,
            
            await firebase_functions.update_new_user(res.profileObj.email,res)
            //take the user through setup
            props.set_views('setup')
        }
        
        //if not the user is new, store these details locally and on the servers and create a new spread sheet
        
        
    }
    function onError(res){
        console.log('Login not successfull',res)
    }

    async function login(){
        var profile_data=await get_email()
        var data= await firebase_functions.read_data(profile_data.email)
        console.log(data)
        if (data!=null){
            //Load the data into local storage: 
            var file_id=data.docs.google_sheet.id
            localStorage.setItem('file_id',file_id)
            localStorage.setItem("profile",JSON.stringify(data.google.profileObj))
            //if yes show the app page 
            console.log("Showing the main app")
            props.set_views('main')

        }else{
            //if not:
            //Store details locally and on firebase,
            window.open("https://arctic-column-387117.web.app", '_blank').focus();
        }


    }

    return (
        <>
            <button onClick={e=>{login()}}>Login with google</button>
        </>
    )

}

{/* <GoogleLogin
                clientId={creds.clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onError}
                cookiePolicy={"single_host_origin"} 
                
            /> */}