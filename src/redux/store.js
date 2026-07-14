import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


// =======================
// Cấu hình redux-persist
// =======================
const rootPersistConfig = {
  // Key dùng làm tên khi lưu dữ liệu vào localStorage.
  // Bạn sẽ thấy một key tên là "persist:root".
  key: 'root',
  // Nơi lưu dữ liệu.
  // storage = localStorage (trên trình duyệt)
  storage: storage.default || storage,
  // Chỉ lưu reducer có tên "user".
  // Các reducer khác sẽ KHÔNG được lưu.
  whitelist: ['user']
}

// Gộp tất cả các reducer con thành một reducer gốc (rootReducer)
const reducers = combineReducers({
  activeBoard: activeBoardReducer, // Reducer quản lý state của Board hiện tại (board đang được mở)
  user: userReducer // Reducer quản lý thông tin người dùng (đăng nhập, profile,...)
})

// Bọc rootReducer bằng redux-persist để thêm chức năng lưu và khôi phục state
const persistedReducers = persistReducer(
  rootPersistConfig, // Cấu hình persist (key, storage, whitelist,...)
  reducers // Reducer gốc cần được persist
)

export const store = configureStore({
  reducer: persistedReducers,
  // Thêm middleware để fix lỗi non-serializable của Redux Toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
