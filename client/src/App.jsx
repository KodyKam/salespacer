// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Setup from "./pages/Setup"
import Settings from "./pages/Settings"
import DaySummary from "./pages/DaySummary"
import MainLayout from "./layouts/MainLayout"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/setup" element={<MainLayout><Setup /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        <Route path="/day-summary" element={<MainLayout><DaySummary /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App