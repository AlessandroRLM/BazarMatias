import axios from "axios"

const url = 'http://127.0.0.1:4000/'

const AxiosInstance = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }  
})


AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('Token')
        if (token) {
            config.headers.Authorization = `Token ${token}`
        }else{
            config.headers.Authorization = ''
        }
        return config
    },
)

AxiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (err) => {
        if(err.response && err.response.status === 401){
            localStorage.removeItem('Token')
            window.location.href = '/'
        }
        throw err
    }
)


export default AxiosInstance