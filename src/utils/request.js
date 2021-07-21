import axios from 'axios'
import { stringify } from 'qs'
import config from '../../config'
import { Loading } from 'zarm';


const MODE = import.meta.env.MODE


const getRequest = (method) => {
    return (url, data, options = {}) => {
        Loading.show();
        let base = config[MODE]
     
        const sign = {
            platform: 'Web',
            device: '6f16dfc5-69cf-4db1-8ac6-70dda4ad62b0',
            version: '1.1.0',
            token: window.localStorage.getItem('token') || '',
        }
        return axios({
            baseURL: base.apiBaseUrl,
            method,
            url,
            ...((method === 'POST'||method === 'PUT') ? { data: options.string ? stringify(data) : data } : {}),
            params: method === 'GET' ? data : options.params,
            headers: {
                "encrypt": 0,
                "sign": JSON.stringify(sign),
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': options.string
                    ? 'application/x-www-form-urlencoded'
                    : 'application/json',
                ...options.headers,

            },
            withCredentials:true, // 设为true,服务器才能拿到cookie
        }).then(res=>{
            Loading.hide();
            if(typeof res.data !== 'object'){
                console.error('数据格式响应错误：')
                console.error('前方拥挤，请刷新再试')
                return res.data
            }
          
            if(res.data.code == 1001){
                 window.location.href = '/login'
            }
            return res.data
        }) .catch((err) => {
            Loading.hide();
            console.error('系统错误', 2)
            return Promise.reject(err)
          })
    }
}

export const get = getRequest('GET')

export const post = getRequest('POST')

export const put = getRequest('PUT')

export const del = getRequest('DELETE')
