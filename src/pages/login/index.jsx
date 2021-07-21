import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Input, Cell, Toast } from 'zarm';
import { post } from 'utils/request'
import './index.less'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();
    
    const handleSubmit = () => {
        console.log(username,password);
        post('/user/login',{username,password}).then(res=>{
            if(!res.success) return Toast.show(res.msg);
            Toast.show('登录成功');
            window.localStorage.setItem('token',res.data.token)
            window.localStorage.setItem('role',res.data.role)
            window.localStorage.setItem('nick',res.data.nick)

            history.push('/home')
        })
    }

    return (
        <div className="login">
            {/* <div className="title">长富后台</div> */}
            <div className="input-box">
                <Cell title="账号">
                    <Input
                        clearable
                        type="text"
                        placeholder="请输入账号"
                        value={username}
                        onChange={(value) => {
                            setUsername(value);
                            console.log(`onChange: ${value}`);
                        }}
                        onBlur={(value) => console.log(`onBlur: ${value}`)}
                    />
                </Cell>
                <Cell title="密码">
                    <Input
                        rows={3}
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={setPassword}
                    />
                </Cell>
            </div>

            <button className="btn" onClick={handleSubmit}>账号登录</button>
        </div>
    )

}
