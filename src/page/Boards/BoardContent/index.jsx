import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'

function BoardContent() {
  const { mode, systemMode } = useColorScheme()
  // Nếu mode = system thì lấy systemMode, ngược lại lấy mode
  const resolvedMode = mode === 'system' ? systemMode : mode
  return (
    <Box sx={{
      bgcolor: resolvedMode === 'dark' ? '#34495e' : '#1976d2',
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.boardBarheight} - ${theme.trello.appBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
    </Box>
  )
}

export default BoardContent
