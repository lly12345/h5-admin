import React from 'react'
import { useState } from 'react';
import { Input, Cell, DatePicker, Stepper, Button,Toast } from 'zarm';
import { formatTime } from 'utils/time'
import {post,put} from 'utils/request'

import './activityForm.less'

export default function ActivityForm(props) {
    console.log(props);
    const [form, setForm] = useState(()=>{

        if(Object.prototype.toString.call(props.activityBody)=="[object Object]"){
            console.log('是个对象');
            return props.activityBody
        }
        return {}
    })


    // 提交表单
    const handleSubmit = () =>{
        console.log(form);
        if(Object.prototype.toString.call(props.activityBody)=="[object Object]"){
            put('/activity',form).then(res=>{
                if (!res.success) return Toast.show(res.msg);
                Toast.show('修改成功')
                props.setVisible(false)
            })
            
        }else{
            post('/activity',form).then(res=>{
                if (!res.success) return Toast.show(res.msg);
                Toast.show('新增成功')
                props.setVisible(false)
            })
            
        }
        
    }


    console.log("提交表单", form);
    return (
        <div className="activity-form">
            <h6>{props.title}</h6>
            <Cell title="活动名称">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                />
            </Cell>
            <Cell title="主办方">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.sponsor}
                    onChange={(value) => setForm({ ...form, sponsor: value })}
                />
            </Cell>
            <Cell title="联系电话">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.contactPhone}
                    onChange={(value) => setForm({ ...form, contactPhone: value })}
                />
            </Cell>
            <Cell title="活动描述">
                <Input
                    rows={3}
                    type="text"
                    placeholder="请输入"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                />
            </Cell>
            <Cell title="活动地址">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.address}
                    onChange={(value) => setForm({ ...form, address: value })}
                />
            </Cell>
            <Cell style={{ color: 'red' }}>人数限制，0 表示不限制</Cell>
            <Cell title="家庭人数" description={<Stepper
                value={form.familyLimit}
                onChange={(value) => setForm({ ...form, familyLimit: value })}
                onInputChange={(value) => setForm({ ...form, familyLimit: value })}
                min={0} max={100} />} />
            {/* <Cell title="大人人数" description={<Stepper onChange={(value) => setForm({ ...form, adultLimit: value })}
                onInputChange={(value) => setForm({ ...form, adultLimit: value })} min={0} max={100} />} />
            <Cell title="总人数" description={<Stepper onChange={(value) => setForm({ ...form, totalLimit: value })}
                onInputChange={(value) => setForm({ ...form, totalLimit: value })} min={0} max={100} />} /> */}
            <div className="submit-btn">
                <Button theme="primary" onClick={handleSubmit}>提交</Button>
            </div>

        </div>
    )
}
