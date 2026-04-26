// client/src/components/BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import SettingsIcon from "@mui/icons-material/Settings"
import AddIcon from "@mui/icons-material/Add"
import ShowChartIcon from "@mui/icons-material/ShowChart"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const BottomNav = ({ onAdd }) => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => navigate("/")}
        />

        <BottomNavigationAction
          label="Add"
          icon={<AddIcon />}
          onClick={() => {
            console.log("NAV ADD CLICKED")
            window.dispatchEvent(new Event("open-add-sale"))
          }}
        />

        <BottomNavigationAction
          label="Stats"
          icon={<ShowChartIcon />}
          onClick={() => window.dispatchEvent(new Event("open-stats"))}
        />

        <BottomNavigationAction
          label="Settings"
          icon={<SettingsIcon />}
          onClick={() => navigate("/settings")}
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav