import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { ToastContainer} from 'react-toastify';
import { Dashboard } from './pages/Dashboard'
import DashboardLayout from './components/DashboardLayout'
import UserProfile from './pages/UserProfile'
import DataAnalysis from './pages/DataAnalysis'
import History from './pages/History'
import Insight from './pages/Insight'
import { AdminLogin } from './pages/AdmiLogin'
import { AdminDashboard } from './pages/AdminDashboard'



function App() {
  

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='admin-login' element={<AdminLogin />} />
        <Route path='admin-dashboard' element={<AdminDashboard />} />
        <Route path="/" element={<DashboardLayout />}> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="insight" element={<Insight />} />
          <Route path='user-profile' element={<UserProfile />} />
          <Route path='analyze' element={<DataAnalysis />} />
          <Route path='history' element={<History />} />
         </Route>

      </Routes>
    </div>
  )
}

export default App
