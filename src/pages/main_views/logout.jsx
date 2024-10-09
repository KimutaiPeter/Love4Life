import React from "react";
import Logout from "../../auth/logout";

export default function Signout(props){
    return (
        <>
        <div class="main_container center_center_vertical">
            <Logout set_views={props.set_views} />
        </div>
        </>
    )
}