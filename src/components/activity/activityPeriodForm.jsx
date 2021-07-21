import React from 'react'
import { useState } from 'react';
import { Input, Cell, DatePicker, Stepper, Button,Toast } from 'zarm';
import { formatTime } from 'utils/time'
import {post} from 'utils/request'

import './activityPeriodForm.less'

export default function ActivityPeriodForm(props) {
    const [form, setForm] = useState({
        activityId:props.activityId
    })

    const [visible, setVisible] = useState(false)
    // 标识编辑的是开始时间还是结束时间
    const [flag, setFlag] = useState('')

    const toggle = (key) => {
        dispatch({
            type: 'visible',
            key,
        });
    };

    // 选择起始时间
    const handleDate = (value) => {

        setVisible(false)
        const date = formatTime('yyyy-MM-dd hh:mm:ss', value)

        console.log(value);
        console.log(date);
        if (flag == 'start') {
            setForm({ ...form, startAt: date })
        } else {
            setForm({ ...form, endAt: date })
        }
    }

    // 提交表单
    const handleSubmit = () =>{
        console.log(form);
        post('/activity-period',form).then(res=>{
            if (!res.success) return Toast.show(res.msg);
            Toast.show('新增成功')
            props.setVisible(false)
        })
    }


    console.log("提交表单", form);
    return (
        <div className="activity-period-form">
            <h6>{props.title}</h6>
            <Cell title="活动名称">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.activityName}
                    onChange={(value) => setForm({ ...form, activityName: value })}
                />
            </Cell>
            <Cell title="场次名称">
                <Input
                    clearable
                    type="text"
                    placeholder="请输入"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                />
            </Cell>

            <Cell title="起始时间">
                <div className="date">
                    <span onClick={() => {
                        setVisible(true)
                        setFlag('start')
                    }}>{form.startAt ? form.startAt : '开始时间'}</span>
                    &nbsp;至&nbsp;
                    <span onClick={() => {
                        setVisible(true)
                        setFlag('end')
                    }}>{form.startAt ? form.endAt : '结束时间'}</span>
                </div>
            </Cell>
            <Cell title="备注">
                <Input
                    rows={3}
                    type="text"
                    placeholder="请输入"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                />
            </Cell>
            <Cell style={{ color: 'red' }}>家庭数量限制，0 表示不限制</Cell>
            <Cell title="家庭数量" description={<Stepper
                value={form.familyLimit}
                onChange={(value) => setForm({ ...form, familyLimit: value })}
                onInputChange={(value) => setForm({ ...form, familyLimit: value })}
                min={0} max={100} />} />
            <div className="submit-btn">
                <Button theme="primary" onClick={handleSubmit}>提交</Button>
            </div>

            <DatePicker
                visible={visible}
                mode="datetime"
                onOk={handleDate}
                onCancel={() => setVisible(false)}
            />


        </div>
    )
}
