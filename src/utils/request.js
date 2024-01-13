import axios from 'axios'
import { useUserStore } from '@/stores/index'
import router from '@/router/index'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res)
  },
  (err) => {
    // TODO 5. 处理401错误
    //特殊错误：
    //"?"表示若response对象为null或不存在，则"response?.code"的值为null而不是报错
    // console.log(err)
    if (err.response?.status === 401) {
      router.push('/login')
    }
    //普通错误：

    // console.log('err.response:', err.response)
    // console.log('err.response.data:', err.response?.data)

    ElMessage.error(err.response?.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
