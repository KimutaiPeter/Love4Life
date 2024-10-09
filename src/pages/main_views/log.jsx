import React, { useState } from "react";
import '../../assets/css/app.css'

import sheets from "../../google sheets/google sheets";

export default function Log(props) {
    const [log_entry, set_log_entry] = useState("")
    const [disable_main_button, set_disable_main_button] = useState(false)






    async function make_log_entry() {
        //Entry is made 
        //Take time and date
        var date_time = new Date()
        var time = `${date_time.getHours()}:${date_time.getMinutes() + 1}:${date_time.getSeconds()}`
        var date = `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()}`
        //Check if theres internet
        if (navigator.onLine) {
            //If there is send the data to the spread sheet
            var done = await sheets.log_entry(props.file_id, [date, time, log_entry])

            if (done) {
                console.log("Log entry made:", done)
                set_log_entry("")
                set_disable_main_button(false)
            }
        } else {
            //If there isnt store it in localstorage under pending_sync-log
            var pending_sync_log = localStorage.getItem("pending_sync_log")
            if (pending_sync_log == null) {
                localStorage.setItem('pending_sync_log', JSON.stringify([[date, time, log_entry]]))
                set_log_entry("")
                set_disable_main_button(false)
            } else {
                localStorage.setItem('pending_sync_log', JSON.stringify([[date, time, log_entry], ...JSON.parse(pending_sync_log)]))
                set_log_entry("")
                set_disable_main_button(false)
            }
            //The next time there is internet syncronise them all
        }



    }



    return (
        <>
            <div class="lmain_container center_center_vertical">
                <textarea value={log_entry} onChange={e => { set_log_entry(e.target.value) }}></textarea>
                <button disabled={disable_main_button} className="lmain_button" onClick={e => { set_disable_main_button(true); make_log_entry() }}>Log</button>
            </div>
        </>
    )
}