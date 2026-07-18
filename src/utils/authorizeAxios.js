import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis/index'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import { store } từ '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
 * như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi
 * hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore
export const injectStore = mainstore => {
  axiosReduxStore = mainstore
}

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

let refreshTokenPromise = null

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

    // Lỗi 401 cho logout luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Lỗi 410 gọi API refreshToken
    const originalRequests = error.config
    if (error.response?.status === 410 && originalRequests) {
      // Đảm bảo gọi 1 lần ko lặp
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch((_error) => {
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally((() => {
            refreshTokenPromise = null
          }))
      }

      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then(accessToken => {
        // Gọi APi bị lỗi gửi lại
        return authorizeAxiosInstance(originalRequests)
      })
    }

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