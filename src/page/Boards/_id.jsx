import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnsDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis/index'
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
    console.log(columnToUpdate)


    // Cập nhật state
    setBoard(newBoard)
  }

  // Func gọi API kéo thả columns khi xong handleEnd
  const moveColumns = (dndOrderedColumns) => {
    // Cập nhật dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //Gọi API Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // Func gọi API kéo thả card trong một columns khi xong handleEnd
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Cập nhật dữ liệu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    //Gọi API Board
    updateColumnsDetailsAPI(columnId, { cardOrderIds: columnToUpdate.cardOrderIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    //update state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // vấn đề card cuối cùng ra column
    if ( prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []


    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', gap: 2, width:'100vw', height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    )
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
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
