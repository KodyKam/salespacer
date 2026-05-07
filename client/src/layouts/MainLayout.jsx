// client/src/layouts/MainLayout.jsx
import { Box } from "@mui/material"

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ pb: 8 }}>
      {children}
    </Box>
  )
}

export default MainLayout