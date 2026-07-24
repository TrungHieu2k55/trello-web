import { Routes, Route, Navigate, Outlet } from 'react-router-dom'


import Board from '~/page/Boards/_id'
import NotFound from '~/page/404/NotFound'
import Auth from '~/page/Auth/Auth'
import AccountVerification from '~/page/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/page/Settings/Settings'
import Boards from '~/page/Boards'


const PrivateRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards' replace={true} />
      } />

      <Route element={<PrivateRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        <Route path='/settings/account' element={<Settings/>}/>
        <Route path='/settings/security' element={<Settings/>}/>
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
