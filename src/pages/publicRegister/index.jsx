import React, { useState, useEffect, useReducer } from 'react'
import './index.less'
import { Tabs, Modal, Popup, Cell, Input, Radio, Button, Toast } from 'zarm';
import { get, put } from 'utils/request'
// 分页组件
import Pagination from '@/components/pagination'

const { Panel } = Tabs;

const tabs = [{
    title: '未联系',
}, {
    title: '需要再联系'
}, {
    title: '已联系'
}]

const contactInit = [
    { label: '未联系', value: 0 },
    { label: '再次联系', value: 1 },
    { label: '已联系', value: 2 },
]

let activityInit = []


const contact = (type) => {
    switch (type) {
        case 0:
            return '未联系'
        case 1:
            return '用户已修改信息'
        case 2:
            return '再次联系'
        case 3:
            return '确认参与'
        case 4:
            return '取消报名'
        default:
            return null
    }
};

const reducer = (state, action) => {
    console.log('state', state);
    switch (action) {
        case 0:
            return {
                contactStatus: 0,
            };
        case 1:
            return {
                contactStatus: 1,
            };
        case 2:
            return {
                contactStatus: 2,
            };
        default:
            return {}
    }
};



export default function PublicRegister(props) {

    const [pageCount, setPageCount] = useState(0);  //页码
    const [current, setCurrent] = useState(0);  //当前tab
    const [list, setList] = useState([]);  //列表
    const [popVisible, setPopVisible] = useState(false);  //弹窗是否可见
    const [state, dispatch] = useReducer(reducer, {}); // 活动未开始，已结束，所有 
    const [contactForm, setContactForm] = useState({
        id: null,
        status: null,
        contactResult: null
    }); //联系结果表单
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        activityId: 0
    })

    useEffect(() => {
        if (props.match.url == '/applyActivity/needContactAgain') {
            dispatch(1)
            setCurrent(1)
        } else if (props.match.url == '/applyActivity/contacted') {
            dispatch(2)
            setCurrent(2)
        } else {
            setCurrent(0)
        }
        getActivity()

    }, [props.match.url])


    useEffect(() => {
        getList()
    }, [query, state])


    // 获取列表
    const getList = () => {
        get('/apply-activity', { ...query, ...state }).then(res => {
            console.log('获取列表', res);
            setList(res.data.list)
            setPageCount(res.data.pageCount)
        })
    }


    // 提交联系结果
    const handleSubmit = () => {
        console.log(contactForm);
        put('/apply-activity/save-contact-result', contactForm).then(res => {
            if (!res.success) return Toast.show(res.msg);
            Toast.show('修改成功')
            setPopVisible(false)
            getList()
        })
    }

    // 退回片区
    const backToArea = (id,name) => {
        const modal = Modal.confirm({
            title: '确认信息',
            content: `确定将${name}退回片区吗`,
            onCancel: () => {
                console.log('点击cancel');
            },
            onOk: () => {
                put('/apply-activity/back-to-area', { id }).then(res => {
                    if (!res.success) return Toast.show(res.msg);
                    Toast.show('退回成功')
                    setPopVisible(false)
                    getList()
                })
            },
        });

    }

    const getActivity = async () => {
        const params = { limit: 1000, simple: 1 }
        const res = await get('/activity', params)
        if(res.data.length>=0){
            activityInit = res.data.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
        }
        
        activityInit.unshift({ label: '全部活动', value: 0 })
        
    }
    

    return (
        <div className="public-register">
            <div className="tabs">
                <Tabs value={current} onChange={(e) => { dispatch(e); setCurrent(e); setQuery({ ...query, page: 1 }); }}>
                    {
                        tabs.map((item, i) => <Panel key={i} title={item.title}></Panel>)
                    }
                </Tabs>
            </div>
            <div className="container">
                {
                    list.map(item => <div className="activity-box" key={item.id}>
                        <ul>
                            <li className="top">
                                <span>昵称：{item.userNick}</span>
                                <span>ID:{item.id}</span>
                            </li>
                            <li>
                                <span>真实姓名：{item.realName}</span> &nbsp;&nbsp;&nbsp;
                                <span>电话号码：{item.contactPhone}</span>
                            </li>
                            <li>
                                <span>人数：</span>
                                <span>{`${item.adultNum}大人带${item.childNum}小孩`}</span>
                            </li>
                            <li>
                                <span>城市：</span>
                                <span>{item.city.name}</span>
                            </li>
                            <li>
                                <span className="label">希望参与时间：</span>
                                <span>{item.expectAt}</span>
                            </li>
                            <li>
                                <span className="label">联系结果：</span>
                                <span>{contact(item.status)}</span>
                            </li>
                            <li>
                                <span className="label">联系备注：</span>
                                <span>{item.contactResult}</span>
                            </li>
                            <li>

                                <div className="operate">
                                    <span onClick={() => { backToArea(item.id,item.realName) }}>退回片区</span>
                                    <span onClick={() => { setPopVisible(true); setContactForm({ contactResult: item.contactResult, status: item.status, id: item.id }) }}>联系结果</span>
                                </div>
                            </li>
                        </ul>
                    </div>)
                }
            </div>

            <Pagination pageCount={pageCount} query={query} setQuery={setQuery}></Pagination>


            {/* 联系结果弹窗 */}
            <Popup
                visible={popVisible}
                direction="center"
                afterClose={() => console.log('关闭')}
                onMaskClick={() => setPopVisible(false)}
            >
                <div className="register-popup">
                    <Cell title="联系结果："
                        description={
                            <Radio.Group
                                type="button"
                                value={contactForm.status}
                                onChange={(value) => {
                                    setContactForm({ ...contactForm, status: value });
                                }}
                            >
                                {
                                    contactInit.slice(1).map(item => {
                                        return (
                                            <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                        )
                                    })
                                }
                            </Radio.Group>
                        }
                    >
                    </Cell>
                    <Cell title="联系备注：">
                        <Input
                            rows={3}
                            type="text"
                            placeholder="请输入"
                            value={contactForm.contactResult}
                            onChange={(value) => { setContactForm({ ...contactForm, contactResult: value }); }}
                        />
                    </Cell>
                    <Button theme="primary" className="btn" onClick={() => handleSubmit()} >确定</Button>

                </div>
            </Popup>

        </div>
    )
}
