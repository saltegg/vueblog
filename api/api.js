import axios from 'axios'

let base = 'http://localhost:8081';
export const getRequest = (url,param) => {
    return axios({
        method:'get',
        data:param,
        transformRequest:[function(data){
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url:`${base}${url}`
    });
};

export const postRequest = (url,params) => {
    return axios({
        method:'post',
        data:params,
        transformRequest:[function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url:`${base}${url}`
    })
};

export const uploadRequest = (url,params) => {
    return axios({
        method:'post',
        data:params,
        url:`${base}${url}`,
        headers: { 
            'Content-Type': 'multipart/form-data' 
        },
    })
};