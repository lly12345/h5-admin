import React, { useState, useEffect } from 'react';
import { get } from 'utils/request'
import { NavLink, useHistory } from "react-router-dom"

import { Popup, Toast, Collapse } from 'zarm';

import './index.less'

export default function Menu(props) {
    const [menus, setMenus] = useState([]);
    const [visible, setVisible] = useState(false);
    const nick = window.localStorage.getItem("nick")

    const history = useHistory();

    useEffect(() => {
        get('/menus').then(res => {
            if (!res.success) return Toast.show(res.msg);
            setMenus(res.data)
        })
        setVisible(props.show)
    }, [props.show])

    // 退出登录
    const loginout = () =>{
        window.localStorage.clear()
        history.replace("/login")
    }

    return (
        <div className="menu">
            <Popup
                visible={visible}
                onMaskClick={() => { setVisible(false); props.setShow(false) }}
                direction="left"
                afterClose={() => console.log('关闭')}
            >
                <div className="popup-container">
                    <div className="userinfo">
                        <div className='avatar'>
                            <img src="" alt="" />
                        </div>
                        <div className="info">
                            <span className="nick">{nick}</span>
                            <button onClick={loginout}>退出</button>
                        </div>
                    </div>
                    <div className="menu-container">
                        {
                            menus.map((item, i) => {
                                if (item.subs) {
                                    return <Collapse animated key={i}>
                                        <Collapse.Item style={{ padding: 0 }} key="0" title={item.title}>
                                            <div className="menu-container">
                                                {
                                                    item.subs.map((sub, sindex) => {
                                                        return (
                                                            <NavLink
                                                                key={sindex}
                                                                to={`${sub.index}`}
                                                                className="menu-item"
                                                                activeClassName="selected"
                                                                onClick={()=>{props.setShow(false);}}
                                                            >{sub.title}</NavLink>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Collapse.Item>
                                    </Collapse>
                                } else {
                                    // return <div key={i} className="menu-box">{item.title}</div>
                                    return (
                                        <NavLink
                                            key={i}
                                            to={`${item.index}`}
                                            className="menu-box"
                                            activeClassName="selected"
                                            onClick={()=>{props.setShow(false);}}
                                        >{item.title}</NavLink>
                                    )
                                }
                            })
                        }

                    </div>


                </div>
            </Popup>

        </div>
    )
}
