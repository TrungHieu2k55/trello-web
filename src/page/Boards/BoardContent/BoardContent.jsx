import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'

function BoardContent({ board }) {
  const oderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

  const { mode, systemMode } = useColorScheme()
  // Nếu mode = system thì lấy systemMode, ngược lại lấy mode
  const resolvedMode = mode === 'system' ? systemMode : mode
  return (
    <Box sx={{
      bgcolor: resolvedMode === 'dark' ? '#34495e' : '#1976d2',
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      p: '10px 0'
    }}>
      <ListColumns columns={ oderedColumns } />
    </Box>
  )
}

export default BoardContent
