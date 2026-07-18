import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

// Khởi tạo một giá trị slice state trong redux
const initialState = {
  currentUser: null
}

//các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào redux, createAsyncThunk kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // axios trả về kết quả property của nó là data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

//Khởi tạo một cái slice trong kho lưu trữ Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // Extra Reducers nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở dây response.data trả về
      const user = action.payload

      state.currentUser = user
    }),
    builder.addCase(logoutUserAPI.fulfilled, (state, action) => {

      state.currentUser = null
    })
  }
})

// Action creators are generated for each case reducer function
// Cập nhập lại dữ liệu thông qua reducer
// export const  {} = userSlice.actions

// Selector là nơi dành cho các compoments bên dưới gọi
// bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer