import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis/index'
import { useState, useEffect } from 'react'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '699c1e1facd2d1f67ce15f4f'
    //call api
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  // Func gọi API tạo mới Column làm lại dữ liệu state board
  const createNewColumn = async (newColumnData) => {

    // Gọi API tạo column mới
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id // hoặc boardId nếu tên biến là boardId
    })

    // Cập nhật state board
    const newBoard = { ...board }
    board.columns.push(createdColumn)
    board.columnOrderIds.push(createdColumn._id)

    // Cập nhật state
    setBoard(newBoard)
  }

  // Func gọi API tạo mới Card làm lại dữ liệu state board
  const createNewCard = async (newCardData) => {
    // Gọi API tạo column mới
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id // hoặc boardId nếu tên biến là boardId
    })

    // Cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }


    // Cập nhật state
    setBoard(newBoard)
  }

  // Func gọi API kéo thả columns khi xong handleEnd
  const moveColumns = async (dndOrderedColumns) => {
    // Cập nhật dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //Gọi API Board
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewCard={createNewCard}
        createNewColumn={createNewColumn}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board
