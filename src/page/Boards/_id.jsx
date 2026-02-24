import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis/index'
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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}

export default Board
