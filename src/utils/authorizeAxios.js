import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo đối tượng axios
let authorizeAxiosInstance = axios.create()

authorizeAxiosInstance.defaults.timeout = 1000*60*10

// Cho phép axios tự động gửi cookie  lên BE
authorizeAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào Request và Response)
 * https://axios-http.com/docs/interceptors
 */
// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    /** Mọi mã http status code nằm trong 200- 299 là error rơi vào đây */

    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)

    //Xử lý lỗi tập trung phần hiển thị thông báo lỗi từ mọi API
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    // Loại 410 để cho refresh token
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance