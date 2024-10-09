import { useState, useEffect } from 'react'
import './assets/css/layouts.css'
import './assets/css/index.css'
import creds from './config'
import { gapi } from 'gapi-script';

import Setup from './pages/setup'
import Auth from './pages/auth';
import Main_app from './pages/main'


function App() {
  const [authO, set_authO] = useState(false)
  const [views, set_view] = useState('auth')

  useEffect(() => {

    function start() {
      gapi.client.init({
        apiKey: "AIzaSyCrajCuNW3YsBr2KS0roXEA-bi2hYswE-0",
        clientId: "331595037617-uvo5j45mn27oi3e5cgl6g69cu9s2e0f8.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive",
      })
      function handle_auth_change() {
        var authenticated = gapi.auth2.getAuthInstance().isSignedIn.get("331595037617-uvo5j45mn27oi3e5cgl6g69cu9s2e0f8.apps.googleusercontent.com")
        set_authO(authenticated)
        console.log("Auth change", authenticated)
      }
      gapi.auth2.getAuthInstance().isSignedIn.listen(handle_auth_change())
    }



    if (creds.clientID) {
      gapi.load('client:auth2', start)
    }


    //Check localstorage for login credentials and profile also the 
    
    
    var profile= localStorage.getItem('profile')
    if(profile==null){
      set_view('auth')
    }else{
      //Check for id for the document 
      var document_id=localStorage.getItem("file_id")
      if(document_id!=null){
        set_view('main')
      }
      
    }
    //if missing show login screen
    //if all there show main app


  }, [])

  function set_views(page) {
    set_view(page)
  }

  return (
    <>
      {(() => {
        if (views == 'auth') {
          return (
            <Auth set_views={set_views}/>
          )
        }else if(views =="setup"){
          return  (<Setup set_views={set_views}></Setup>)
        }else if(views=="main"){
          return (<Main_app set_views={set_views}/>)
        }
      })()}
    </>
  )
}

export default App
