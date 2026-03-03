import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis/index'
import { useState, useEffect } from 'react'


function Board() {
  const [board, setBoard] = useState(null)

  // useEffect(() => {
  //   const boardId = '699c1e1facd2d1f67ce15f4f'
  //   //call api
  //   fetchBoardDetailsAPI(boardId).then(board => {
  //     setBoard(board)
  //   })
  // }, [])


  //Function Gọi API tạo mới column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Cập nhật state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  //Function Gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={mockData.board}/>
      <BoardContent
        board={mockData.board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
