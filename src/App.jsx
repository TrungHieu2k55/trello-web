import { Routes, Route, Navigate, Outlet } from 'react-router-dom'


import Board from '~/page/Boards/_id'
import NotFound from '~/page/404/NotFound'
import Auth from '~/page/Auth/Auth'
import AccountVerification from '~/page/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const PrivateRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/699c1e1facd2d1f67ce15f4f' replace={true} />
      } />

      <Route element={<PrivateRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/* Authencation */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />
      <Route path='/account/verification' element={<AccountVerification/>} />

      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
