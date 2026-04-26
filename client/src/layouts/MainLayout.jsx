// client/src/layouts/MainLayout.jsx
import { Box } from "@mui/material"
import BottomNav from "../components/BottomNav"
import { useState } from "react"
import StatsModal from "../components/StatsModal"

const MainLayout = ({ children }) => {
  const [openAdd, setOpenAdd] = useState(false)

  return (
    <Box sx={{ pb: 8 }}>
      {children}
        <StatsModal />

      <BottomNav onAdd={() => setOpenAdd(true)} />
    </Box>
  )
}

export default MainLayout