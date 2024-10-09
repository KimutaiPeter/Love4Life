import React, { useState } from "react";
import '../assets/css/setup.css'
import sheets from "../google sheets/google sheets";

export default function Setup(props) {
    const [habits, set_habits] = useState([])
    const [habit, set_habit] = useState('')
    const [done,set_done]=useState(false)


    function add_habit() {
        set_habits([habit, ...habits])
        set_habit('')
    }


    async function complete_setup() {
        var profile_data = JSON.parse(localStorage.getItem('profile'))
        console.log(profile_data.email)

        //Create exel sheet,
        //store the id locally and at the firebase db
        //populate the excel sheet
        //sheets.listMajors()

        var drive_setup_status=await sheets.drive_setup(profile_data.email,habits)
        console.log(drive_setup_status)
        console.log('set up is now complete')
        props.set_views('main')

    }

    



    return (
        <>
            <div class="smain_container center_top_vertical">

                <div class="snew_habit_container center_center_horizontal">
                    <input type="text" placeholder="New Habit" value={habit} onChange={e => { set_habit(e.target.value); }} name="" id="" />
                    <button onClick={e => { add_habit() }}>Add</button>
                </div>

                <div class="shabits_container left_center_vertical">
                    {
                        habits.map(new_habit => {
                            return (
                                <div class="shabit_container left_center_horizontal">
                                    <img src="/imgs/dots.svg" alt="" />
                                    <span>{new_habit}</span>
                                </div>)
                        })
                    }
                </div>

                <button class="smain_button" disabled={done} onClick={e => { set_done(true);e.target.innerHtml="Setting up"; complete_setup() }}>Done</button>
            </div>
        </>
    )
}