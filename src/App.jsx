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
  const [render_ready,set_render_ready]=useState(true)

  useEffect(() => {


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

  if(render_ready){
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
  }else{
    return(
      <>
        <center>
          <h1>Loading...</h1>
        </center>
      </>
    )
  }

  
}

export default App
