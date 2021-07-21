import React, { useState } from 'react'
import {useLocation,useHistory} from "react-router-dom";

import './index.less'
import Menu from '@/layout/menu'
export default function NavBar(props) {
    const [show, setShow] = useState(false)
    const location = useLocation()
    const history = useHistory()

    let part = null
    if(location.pathname == '/home'){
        part = <svg t="1623134492122" className="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6553" width="200" height="200"><path d="M1006.971948 571.702547c18.110318 0 22.491302-10.344075 9.669684-22.973303l-481.308552-473.975188c-12.827759-12.630251-33.838266-12.630251-46.666024 0l-481.309575 473.975188c-12.820595 12.629228-8.440634 22.973303 9.670707 22.973303l98.995297 0c18.111342 0 32.996044 14.60021 32.996044 32.496647l0 324.952144c0 17.893367 14.885726 32.492554 32.996044 32.492554l197.991617 0c18.112365 0 32.997068-14.599187 32.997068-32.492554L413.004259 669.190442c0-17.894391 14.891866-32.493577 32.996044-32.493577l131.999528 0c18.103155 0 32.996044 14.599187 32.996044 32.493577l0 259.960897c0 17.893367 14.884703 32.492554 32.996044 32.492554l197.992641 0c18.110318 0 32.996044-14.599187 32.996044-32.492554L874.980606 604.199195c0-17.896437 14.884703-32.496647 32.996044-32.496647L1006.971948 571.702547z" p-id="6554" fill="#ffffff"></path></svg>
    }else{
        part = <svg t="1624256160120" onClick={()=>history.goBack(-1)} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3210" width="200" height="200"><path d="M410.39 512l340.14-335.13a63.74 63.74 0 0 0 0-91 65.92 65.92 0 0 0-92.29 0l-384.93 379.3a67.39 67.39 0 0 0 0 93.68l384.93 379.32a66 66 0 0 0 92.29 0 63.74 63.74 0 0 0 0-91z" p-id="3211" fill="#ffffff"></path></svg>
    }
   

    return (
        <div>
            {/* navbar */}
            <div className="navbar">
                <span>
                    {part}
                </span>
                <span className="title">{props.children}</span>
                <span onClick={() => { setShow(true) }}>
                    <svg t="1623134229949" className="icon menu" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4792" width="200" height="200"><path d="M867.995 459.647h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353z" p-id="4793" fill="#ffffff"></path><path d="M867.995 763.291h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353z" p-id="4794" fill="#ffffff"></path><path d="M156.005 260.709h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353z" p-id="4795" fill="#ffffff"></path></svg>
                </span>
            </div>
            {/* menu */}
            <Menu show={show} setShow={setShow} ></Menu>
        </div>

    )
}
