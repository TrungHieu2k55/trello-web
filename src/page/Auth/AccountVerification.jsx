import { useState, useEffect} from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis/index'

function AccountVerification() {
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo biến state để coi verify thành công tk
  const [verified, setVerified] = useState(false)

  //API verify tk
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to='/404' />
  }

  if (!verified) {
    return <PageLoadingSpinner caption='Verify your account ...' />
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
