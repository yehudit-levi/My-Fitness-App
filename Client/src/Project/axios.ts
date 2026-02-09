import axios from 'axios'

const axiosInstance = axios.create({ baseURL: 'https://localhost:7225/api'  })

axiosInstance.interceptors.request.use((request: any) => {
    //console.log(request)
    return request
})

axiosInstance.interceptors.response.use((response: any) => {
    //console.log(response)
    return response
})

export default axiosInstance