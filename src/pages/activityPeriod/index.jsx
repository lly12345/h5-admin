import React, { useState, useEffect } from 'react';
import { get, del } from 'utils/request'
import { Popup, Button, Icon, Modal, Toast } from 'zarm';
import './index.less'

// 活动表单组件
import ActivityPeriodForm from '@/components/activity/activityPeriodForm.jsx'
import PeriodForm from '@/components/activityPeriod/index.jsx'
// 分页组件
import Pagination from '@/components/pagination'

export default function ActivityPeriod() {
    const [activities, setActivities] = useState([]); //活动列表
    const [visible, setVisible] = useState(false);  //弹窗是否可见
    const [title, setTitle] = useState('');         //弹窗标题
    const [activityId, setActivityId] = useState(0);  //要修改的活动id
    const [activityBody, setActivityBody] = useState(null);  // 修改活动时传的活动信息用来渲染表单
    const [pageCount, setPageCount] = useState(0);  //弹窗是否可见
    const [imgSrc, setImgSrc] = useState(null);  //弹窗是否可见
    const [query, setQuery] = useState({
        page: 1,
        limit: 10
    })
    let component  //选择渲染的组件


    useEffect(() => {
        getList()
    }, [visible, query])


    if (title == '修改') {
        component = <PeriodForm title={title} activityId={activityId} setVisible={setVisible} activityBody={activityBody} />
    } else if (title == '新增活动') {
        component = <ActivityForm title={title} activityId={activityId} setVisible={setVisible} activityBody={activityBody} />
    } else {
        component = <img className="img-code" src={imgSrc} alt="" />
    }

    // 生成二维码
    const qrCode = (activityId) => {
        get('/activity/get-qr-code', { activityId }, { responseType: 'blob' }).then(res => {
            console.log(res);
            let blob = new Blob([res], {
                type: 'image/jpeg;'
            });
            setImgSrc(window.URL.createObjectURL(blob))
        })
    }

    // 删除操作
    const handleDelete = async (id) => {
        const res = await del(`/activity-period/${id}`)
        if (!res.success) return Toast.show(res.msg);
        Toast.show('删除成功')
        getList()
    }

    // 获取活动列表
    const getList = () => {
        get('/activity-period/index', query).then(res => {
            setActivities(res.data.list)
            setPageCount(res.data.pageCount)
        })
    }


    return (
        <div className="activity-period">

            {/* <div className="add-btn">
                <Button size="xs" onClick={() => { setVisible(true); setTitle('新增活动'); }} icon={<Icon type='add-round' theme="success" />}>新增活动</Button>
            </div> */}

            {
                activities.map(item => <div className="activity-box" key={item.id}>
                    <ul>
                        <li className="top">
                            <span>{item.activityName}</span>
                            <span>ID:{item.id}</span>
                            <div className="edit">
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
                            </div>

                        </li>
                        <li>
                            <span>备注：</span>
                            <span>{item.description}</span>
                        </li>
                        <li className="time">
                            <span>活动时间：</span>
                            <span>{item.startAt} 至 {item.endAt}</span>
                        </li>
                        <li>
                            <span>活动地址：</span>
                            <span>{item.address}</span>
                        </li>
                        <li className="questionnaire">
                            <span>问卷绑定：</span>
                            <span>{item.questionnairesId > 0 ? item.questionnaireTitle : '未绑定'}</span>
                        </li>
                        <li>
                            <span className="label">问卷操作：</span>
                            <div className="operate">
                                <span onClick={() => { setVisible(true); setTitle('新增场次'); setActivityId(item.id); setActivityBody(null) }}>查看问卷</span>
                                {/* <span onClick={() => { setVisible(true); setTitle('修改'); setActivityBody(item) }}>修改</span> */}
                                <span onClick={() => {
                                    Modal.confirm({
                                        title: '删除',
                                        content: `确定删除${item.name}吗`,
                                        onOk: () => {
                                            handleDelete(item.id)
                                        },
                                    });
                                }}>问卷分析</span>
                                <span onClick={() => { qrCode(item.id); setVisible(true); setTitle('二维码') }}>生成二维码</span>
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
