import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Feed from "./pages/Feed"
import ItemDetail from "./pages/ItemDetail"
import MyPosts from "./pages/MyPosts"
import MyClaims from "./pages/MyClaims"
import ReportItem from "./pages/ReportItem"
import Profile from "./pages/Profile"
import LoginModal from "./components/LoginModal"
import { useAuth } from "./context/AuthContext"

function App() {
  const { authMode } = useAuth()
  return (
    <Router>
      {authMode && <LoginModal/>}
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/my-claims" element={<MyClaims />} />
        <Route path="/report" element={<ReportItem />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App