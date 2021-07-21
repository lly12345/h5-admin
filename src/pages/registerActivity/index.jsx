import React, { useState, useEffect, useReducer } from 'react'
import './index.less'
import { Tabs, Picker, Popup, Cell, Input, Radio,Button,Toast } from 'zarm';
import { get, put } from 'utils/request'
// 分页组件
import Pagination from '@/components/pagination'

const { Panel } = Tabs;

const tabs = [{
    title: '所有',
    query: {}
}, {
    title: '活动未开始'
}, {
    title: '活动已结束'
}]

const contactInit = [
    { label: '全部联系结果', value: -1},
    { label: '未联系', value: 0 },
    { label: '用户已修改信息', value: 1 },
    { label: '再次联系', value: 2 },
    { label: '确认参与', value: 3 },
    { label: '取消报名', value: 4 }
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
            return {};
        case 1:
            return {
                notStart: 1
            };
        case 2:
            return {
                ended: 1
            };
        default:
            return {}
    }
};



export default function RegisterActivity(props) {

    const [pageCount, setPageCount] = useState(0);  //页码
    const [current, setCurrent] = useState(0);  //当前tab
    const [list, setList] = useState([]);  //列表
    const [periodList, setPeriodList] = useState([]);  //列表
    const [visible, setVisible] = useState(false);  //弹窗是否可见
    const [popVisible, setPopVisible] = useState(false);  //弹窗是否可见
    const [state, dispatch] = useReducer(reducer, {}); // 活动未开始，已结束，所有 
    const [data, setData] = useState({}); //弹窗资源  
    const [contactForm, setContactForm] = useState({
        id:null,
        status:null,
        contactResult:null
    }); //联系结果表单
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        activityId: 0
    })
    
    useEffect(() => {
        console.log('url',props.match.url);
        if (props.match.url == '/registerActivity/notStart') {
            dispatch(1)
            setCurrent(1)
        } else if (props.match.url == '/registerActivity/ended') {
            dispatch(2)
            setCurrent(2)
        } else {
            dispatch(0)
            setCurrent(0)
        }
        getActivity()
    }, [props.match.url])


    useEffect(() => {
        getList()
    }, [query, state])

    useEffect(() => {
        getPeriodList()
    }, [query.activityId])



    // 获取列表
    const getList = () => {
        get('/register-activity', { ...query, ...state }).then(res => {
            setList(res.data.list)
            setPageCount(res.data.pageCount)
        })
    }

    // 获取场次列表
    const getPeriodList = () => {
        get('/activity-periods', { limit: 1000, simple: 1, activityId: query.activityId }).then(res => {

            const data = res.data.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
            data.unshift({ label: '全部活动', value: 0 })
            setPeriodList(data)
        })
    }



    const handleSearch = (val) => {
        if (val === 'activity') {
            setData({
                title: 'activity',
                list: activityInit
            })
        } else if (val === 'activityPeriod') {
            setData({
                title: 'activityPeriod',
                list: periodList
            })

        } else {
            setData({
                title: 'contact',
                list: contactInit
            })
        }

        setVisible(true)
    }

    const handleComfire = (val, title) => {
        if (title === 'activity') {
            setQuery({
                ...query,
                page: 1,
                activityId: val.value
            })
        } else if (title === 'activityPeriod') {
            setQuery({
                ...query,
                page: 1,
                activityPeriodId: val.value
            })

        } else if (title === 'contact') {
            setQuery({
                ...query,
                page: 1,
                contactStatus: val.value
            })

        } else {
            console.log(val);
            console.log(title);
        }

        setVisible(false)
    }

    // 提交联系结果
    const handleSubmit = () =>{
        put('/register-activity/save-contact-result',contactForm).then(res=>{
            if (!res.success) return Toast.show(res.msg);
            Toast.show('修改成功')
            setPopVisible(false)
            getList()
        })
    }

    const getActivity = async () => {
        const params = { limit: 1000, simple: 1 }
        const res = await get('/activity', params)
        activityInit = res.data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
        activityInit.unshift({ label: '全部活动', value: 0 })
        console.log(activityInit);
    }
    

    return (
        <div className="register-activity">
            <div className="tabs">
                <Tabs value={current} onChange={(e) => { dispatch(e); setCurrent(e); setQuery({ ...query, page: 1 }); }}>
                    {
                        tabs.map((item, i) => <Panel key={i} title={item.title}></Panel>)
                    }
                </Tabs>
            </div>
            <div className="picker">
                <div className="btn" onClick={() => handleSearch('activity')}>选择活动<span></span></div>
                <div className="btn" onClick={() => handleSearch('activityPeriod')}>选择场次 <span></span></div>
                <div className="btn" onClick={() => handleSearch('contact')}>联系结果<span></span></div>

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
                                <span className="label">参与活动：</span>
                                <span>{`${item.activityName}【${item.activityPeriodName}】`}</span>
                            </li>
                            <li>
                                <span>经销商：</span>
                                <span>{item.sponsor}</span>
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
                                    <span style={{ color: '#000' }}>操作：</span>
                                    <span onClick={() => { setPopVisible(true);setContactForm({...contactForm,status:item.status,id:item.id})  }}>联系结果</span>
                                </div>
                            </li>
                        </ul>
                    </div>)
                }
            </div>

            <Pagination pageCount={pageCount} query={query} setQuery={setQuery}></Pagination>

            <Picker
                visible={visible}
                dataSource={data.list}
                onOk={(val) => handleComfire(val[0], data.title)}
                maskClosable={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            />
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
                                    setContactForm({...contactForm,status:value});
                                }}
                            >
                                {
                                    contactInit.slice(1).map(item=>{
                                        return(
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
                            onChange={(value) => { setContactForm({...contactForm,contactResult:value});}}
                        />
                    </Cell>
                    <Button theme="primary" className="btn" onClick={()=>handleSubmit()} >确定</Button>

                </div>
            </Popup>

        </div>
    )
}
