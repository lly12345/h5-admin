// 分页组件
import React, { useState,useEffect} from 'react'
import {   Button, Picker, Icon } from 'zarm';


const pageCenter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export default function Pagination(props) {
    const [visible, setVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(props.query.page)
    let data = []
    for (let i=1; i<=props.pageCount; i++) {
        data.push({ label: `第${i}页`, value: i })
    }

    useEffect(()=>{
        setCurrentPage(props.query.page)
    },[props.query])

    // 选择页码
    const handleSelect = (current) =>{
        console.log('选择页码',current);
        if(current){
            setCurrentPage(current)
            props.setQuery({...props.query, page:current})
            setVisible(false)
        }
    }

    return (
        <div>
            <div className="group-btn" style={pageCenter}>
                <Button size="xs" onClick={() => handleSelect(currentPage-1)} disabled={currentPage==1} icon={<Icon type="arrow-left" theme="success" />}></Button>
                <Button size="sm" onClick={() => setVisible(true)} style={{ margin: '0 10px' }}>第{currentPage}页</Button>
                <Button size="xs" onClick={() => handleSelect(currentPage+1)} disabled={currentPage>=props.pageCount} icon={<Icon type="arrow-right" theme="success" />}></Button>
            </div>

            <Picker
                visible={visible}
                dataSource={data}
                value={currentPage}
                onOk={(val)=>handleSelect(val[0].value)}
                maskClosable={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            />

        </div>
    )
}
