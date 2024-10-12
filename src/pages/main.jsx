import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import sheets from "../google sheets/google sheets";

import Signout from "./main_views/logout";
import Log from "./main_views/log";
import Habits from "./main_views/habits";

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
                <Log file_id={file_id} set_views={props.set_views} />
                <Habits />
                <Signout set_views={props.set_views}></Signout>
            </SwipeableViews>
        </>
    )
}