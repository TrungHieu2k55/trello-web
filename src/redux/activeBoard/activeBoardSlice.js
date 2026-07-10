import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sort'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khởi tạo một giá trị slice state trong redux
const initialState = {
  currentActiveBoard: null
}

//các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào redux, createAsyncThunk kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // axios trả về kết quả property của nó là data
    return response.data
  }
)

//Khởi tạo một cái slice trong kho lưu trữ Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, gán cho nó ra biến ý nghĩa hơn
      let board = action.payload

      //Xử lý dữ liệu nếu cần thiết


      //Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // Extra Reducers nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở dây response.data trả về
      const board = action.payload

      // //Xử lý dữ liệu nếu cần thiết
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      //Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
// Cập nhập lại dữ liệu thông qua reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector là nơi dành cho các compoments bên dưới gọi
// bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer