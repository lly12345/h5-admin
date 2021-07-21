import React from 'react'

import './index.less'

import banner from '@/assets/banner.png'
import menu1 from '@/assets/menu1.png'
import menu2 from '@/assets/menu2.png'
import menu3 from '@/assets/menu3.png'
import menu4 from '@/assets/menu4.png'
import menu5 from '@/assets/menu5.png'
import { NavLink, useHistory } from "react-router-dom"

const menuList = [{
    title: '活动管理',
    img: menu1,
    url: '/activities'
}, {
    title: '活动场次管理',
    img: menu2,
    url: '/activityPeriod'
}, {
    title: '扫码报名',
    img: menu3,
    url: '/registerActivity/all'
}, {
    title: '公开报名',
    img: menu4,
    url: '/applyActivity/notContact'
}, {
    title: '问卷管理',
    img: menu5,
    url:'/home'
}]


export default function Home() {
    const history = useHistory();
    return (
        <div className="home">
            <div className="banner">
                <img src={banner} alt="" />
            </div>
            <div className="menu-container">
                {
                    menuList.map((item, i) => {
                        return <NavLink to={item.url} key={i}>
                            <div  className="menu-box">
                                <img src={item.img} alt="" />
                                <span>{item.title}</span>
                            </div>
                        </NavLink>
                    })
                }

            </div>

        </div>
    )
}
