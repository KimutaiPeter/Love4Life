import React, { useEffect, useState } from "react";

import sheets from "../../google sheets/google sheets";

export default function Habits() {
    const [habits, set_habits] = useState([])
    const [todays_habits, set_todays_habits] = useState({date:"",habits:{},range:null})
    const [file_id,set_file_id]=useState('')



    useEffect((() => {

        //Check the internet connected
        //Look for the habits in local storage
        //if not there look for the habits in the document
        //if its there and internet connection is on compar online and offline habit number for updates and if they are not the same
        //Check that the number is the same
        //Display them

        //Store habits as a list
        //Store todays updated habits locally as a dictionary
        //Each time its updated update todays updated habits 
        //based on todays habits send to the sheets or localstorage
        //The first time you send to the sheets, get the sheet update range to be edited once again
        //So those are 3 data structures: habits:list,pending_sync_habits:list,todays_habits:dict{date,habits:{id:{habit:,done:}}
        function handle_day_change(new_habits) {
            var date_time = new Date()
            var date = `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()}`
            var local_current_habits = JSON.parse(localStorage.getItem("local_current_habits"))
            console.log(local_current_habits)
            if (local_current_habits == null) {
                console.log("Creating new current habits")
                var new_local_current_habits = {}
                new_local_current_habits['date'] = date
                var stored_habits = {}
                new_habits.map((habit_element, habit_index) => {
                    stored_habits[habit_index] = { "habit": habit_element, 'done': false }
                })
                new_local_current_habits['habits'] = stored_habits
                new_local_current_habits['range']=null
                console.log(new_local_current_habits)
                localStorage.setItem('local_current_habits', JSON.stringify(new_local_current_habits))
                set_todays_habits(new_local_current_habits)
            } else {
                if (local_current_habits['date'] != date) {
                    console.log('A new day new habits')
                    var new_local_current_habits = {}
                    new_local_current_habits['date'] = date
                    var stored_habits = {}
                    new_habits.map((habit_element, habit_index) => {
                        stored_habits[habit_index] = { "habit": habit_element, 'done': false, }
                    })
                    new_local_current_habits['habits'] = stored_habits
                    new_local_current_habits['range']=null
                    console.log(new_local_current_habits)
                    localStorage.setItem('local_current_habits', JSON.stringify(new_local_current_habits))
                    set_todays_habits(new_local_current_habits)
                }else{
                    console.log('Setting todays habits to ',local_current_habits)
                    localStorage.setItem('local_current_habits', JSON.stringify(local_current_habits))
                    set_todays_habits(local_current_habits)
                }
            }
            set_file_id(localStorage.getItem('file_id'))
        }

        async function set_up() {
            console.log("Starting habits set up")
            var file_id = localStorage.getItem('file_id')
            var online_habits = await sheets.read_habits(file_id)
            online_habits = online_habits[0]
            var local_habits = JSON.parse(localStorage.getItem('habits'));
            var habits_update_needed = arraysEqual(online_habits, local_habits)
            console.log("Are they the same?:", habits_update_needed)
            if (habits_update_needed) {
                console.log("Habits update not needed:", online_habits.length, local_habits.length)
                set_habits(local_habits)
                handle_day_change(local_habits)
            } else {
                console.log("Habits update needed")
                localStorage.setItem('habits', JSON.stringify(online_habits))
                set_habits(online_habits)
                handle_day_change(online_habits)
            }
        }

        set_up()
    }), [])


    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a === null || b == null) return false;
        if (a.length !== b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }


    function handle_online_update(){

        
    }

    async function update_habit_state(id){
        var local_current_habits = JSON.parse(localStorage.getItem("local_current_habits"))
        local_current_habits['habits'][id]['done']= !local_current_habits['habits'][id]['done']
        
        var online_habits_data=[]
        Object.entries(local_current_habits['habits']).map(([key, habit_elem]) => (
            online_habits_data[key]=habit_elem['done']
          ));
        console.log(online_habits_data)
        if(navigator.onLine){
            var date_time = new Date()
            var date = `${date_time.getDate()}-${date_time.getMonth() + 1}-${date_time.getFullYear()}`
            online_habits_data.push(date)
            var responce=await sheets.habits_entry(file_id,local_current_habits['range'],online_habits_data)
            console.log(responce)
            local_current_habits['range']=responce['updatedRange']
        }
        localStorage.setItem('local_current_habits', JSON.stringify(local_current_habits))
        set_todays_habits(local_current_habits)
        
        
    }




    return (
        <div className='main_container center_center_vertical'>


            <div className="habits_container left_center_vertical">
                {(() => {
                return Object.entries(todays_habits['habits']).map(([key, habit_elem]) => (
                    <div class="habit_container left_center_horizontal" key={key}>
                      <input type="checkbox" checked={habit_elem['done']} onChange={e=>{console.log(key);update_habit_state(key)}} name="" id="" />
                      <span>{habit_elem['habit']}</span>
                    </div>
                  ));
            })()}
            </div>

            

            <button style={{ margin: "25px" }}>Done</button>
        </div>
    )
}