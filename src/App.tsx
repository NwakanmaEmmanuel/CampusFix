import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateRequest from './pages/CreateRequest'
import Matching from './pages/Matching'
import Chat from './pages/Chat'
import Completion from './pages/Completion'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      <div className="flex-1 pb-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new" element={<CreateRequest />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/chat/:requestId" element={<Chat />} />
          <Route path="/complete/:requestId" element={<Completion />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
