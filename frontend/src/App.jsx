import { Navigate, Route, Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ComplaintDetails from './pages/ComplaintDetails.jsx'
import CreateComplaint from './pages/CreateComplaint.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditComplaint from './pages/EditComplaint.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Signup from './pages/Signup.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaints/new" element={<CreateComplaint />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
            <Route path="/complaints/:id/edit" element={<EditComplaint />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
