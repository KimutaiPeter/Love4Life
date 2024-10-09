import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import sheets from "../google sheets/google sheets";

import Signout from "./main_views/logout";
import Log from "./main_views/log";

export default function Main_app(props) {
    const [file_id,set_file_id]=useState('')
    const [internet_connectivity, set_internet_connectivity] = useState(false)
    const habits = null;
    useEffect(() => {
        set_internet_connectivity(navigator.onLine)
        var local_habits = JSON.parse(localStorage.getItem('habits'))


        var doc_id = localStorage.getItem('file_id')
        set_file_id(doc_id)
        console.log(local_habits, doc_id)

        async function asyncronized_setup() {
            //Check the internet connected
            //Look for the habits in local storage
            //if not there look for the habits in the document
            if (local_habits == null) {
                var habits = sheets.read_habits(doc_id)
            }
            //if its there and internet connection is on compar online and offline habit number for updates and if they are not the same
            //Check that the number is the same
            //Display them
        }
        asyncronized_setup()
    }, [])


    window.ononline = function () {
        alert('You are now online');
    }

    window.onoffline = function () {
        alert('You are now offline');
    }


    return (
        <>
            <SwipeableViews enableMouseEvents>
                <div className='main_container center_center_vertical'>
                    <div className="habits_container left_center_vertical">
                        <div class="habit_container left_center_horizontal">
                            <input type="checkbox" name="" id="" />
                            <span>Working out</span>
                        </div>

                    </div>

                    <button>Done</button>
                </div>
                <Log file_id={file_id} set_views={props.set_views} />
                <Signout set_views={props.set_views}></Signout>
            </SwipeableViews>
        </>
    )
}