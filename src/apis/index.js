import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

/** Boards */
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   // axios trả về kết quả property của nó là data
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // axios trả về kết quả property của nó là data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnsDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  // axios trả về kết quả property của nó là data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  // axios trả về kết quả property của nó là data
  return response.data
}

/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
