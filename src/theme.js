import { extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarheight: '60px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary:deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  },
  colorSchemeSelector: 'class'
})

export default theme