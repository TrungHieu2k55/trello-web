import { Routes, Route, Navigate } from 'react-router-dom'


import Board from '~/page/Boards/_id'
import NotFound from '~/page/404/NotFound'
import Auth from '~/page/Auth/Auth'
import AccountVerification from '~/page/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/699c1e1facd2d1f67ce15f4f' replace={true} />
      } />

      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authencation */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />
      <Route path='/account/verification' element={<AccountVerification/>} />

      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
