// client/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Setup from "./pages/Setup"
import Settings from "./pages/Settings"
import DaySummary from "./pages/DaySummary"
import MainLayout from "./layouts/MainLayout"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import ProSuccess from "./pages/ProSuccess"
import PrivacyPolicy from "./pages//PrivacyPolicy"
import Terms from "./pages/Terms"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/welcome" />
}

const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout><Dashboard /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/setup" element={
          <PrivateRoute>
            <MainLayout><Setup /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout><Settings /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/day-summary" element={
          <PrivateRoute>
            <MainLayout><DaySummary /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/pro-success" element={<PrivateRoute><ProSuccess /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/welcome" />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App