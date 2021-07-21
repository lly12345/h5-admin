import React, { useState, useEffect } from 'react';
import { get, del } from 'utils/request'
import { Link } from "react-router-dom"
import { Popup, Button, Icon,Modal,Toast } from 'zarm';
import './index.less'

// 活动表单组件
import ActivityPeriodForm from '@/components/activity/activityPeriodForm.jsx'
import ActivityForm from '@/components/activity/activityForm.jsx'
// 分页组件
import Pagination from '@/components/pagination'

export default function Activity() {
    const [activities, setActivities] = useState([]); //活动列表
    const [visible, setVisible] = useState(false);  //弹窗是否可见
    const [title, setTitle] = useState('');         //弹窗标题
    const [activityId, setActivityId] = useState(0);  //要修改的活动id
    const [activityBody, setActivityBody] = useState(null);  // 修改活动时传的活动信息用来渲染表单
    const [pageCount, setPageCount] = useState(0);  //页码
    const [imgSrc, setImgSrc] = useState(null);  //弹窗是否可见
    const [query, setQuery] = useState({
        page: 1,
        limit: 10
    })
    let component  //选择渲染的组件
     

    useEffect(() => {
        getList()
    }, [visible, query])


    if (title == '新增场次') {
        component = <ActivityPeriodForm title={title} activityId={activityId} setVisible={setVisible} />
    } else if (title == '新增活动' || title == '修改') {
        component = <ActivityForm title={title} activityId={activityId} setVisible={setVisible} activityBody={activityBody} />
    }else{
        component = <img className="img-code" src={imgSrc} alt=""/>
    }

    // 生成二维码
    const qrCode = (activityId) =>{
        get('/activity/get-qr-code', {activityId},{responseType: 'blob'}).then(res => {
            console.log(res);
            let blob = new Blob([res], {
                type: 'image/jpeg;'
            });
            setImgSrc(window.URL.createObjectURL(blob))
        })
    }

    // 删除操作
    const handleDelete = async(id) =>{
        const res = await del(`/activity/${id}`)
        if (!res.success) return Toast.show(res.msg);
        Toast.show('删除成功')
        getList()
    }

    // 获取活动列表
    const getList = () =>{
        get('/activity/index', query).then(res => {
            setActivities(res.data.list)
            setPageCount(res.data.pageCount)
        })
    }


    return (
        <div className="activity">
            
            <div className="add-btn">
                <Button size="xs" onClick={() => { setVisible(true); setTitle('新增活动'); }} icon={<Icon type='add-round' theme="success" />}>新增活动</Button>
            </div>

            {
                activities.map(item => <div className="activity-box" key={item.id}>
                    <ul>
                        <li className="top">
                            <span>{item.name}</span>
                            <span>ID:{item.id}</span>
                        </li>
                        <li>
                            <span>活动状态：</span>
                            <span>{item.status == 1 ? '正常' : '取消'}</span>
                        </li>
                        <li>
                            <span>活动主办：</span>
                            <span>{item.address}</span>
                        </li>
                        <li>
                            <span>家庭数量限制：</span>
                            <span>{item.familyLimit}</span>
                        </li>
                        <li>
                            <span className="label">活动操作：</span>
                            <div className="operate">
                                <span onClick={() => { setVisible(true); setTitle('新增场次'); setActivityId(item.id); setActivityBody(null) }}>新增场次</span>
                                <span onClick={() => { setVisible(true); setTitle('修改'); setActivityBody(item) }}>修改</span>
                                <span onClick={() => {
                                    Modal.confirm({
                                        title: '删除',
                                        content: `确定删除${item.name}吗`,
                                        onOk: () => {
                                            handleDelete(item.id)
                                        },
                                    });
                                }}>删除</span>
                                <span onClick={() => {qrCode(item.id);setVisible(true);setTitle('二维码')}}>生成二维码</span>
                            </div>
                        </li>
                    </ul>
                </div>)
            }
            
            {/* 页码 */}
            <Pagination pageCount={pageCount} query={query} setQuery={setQuery}></Pagination>
            {/* 新增场次弹窗 */}
            <Popup
                visible={visible}
                direction="center"
                afterClose={() => console.log('关闭')}
                onMaskClick={() => setVisible(false)}
            >
                <div className="popup-box">
                    {
                        component
                    }

                </div>
            </Popup>
        </div>
    )
}
