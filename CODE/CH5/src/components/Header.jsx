import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' 
import { useAuth } from '../context/AuthContext.jsx' 
import { User } from './User.jsx'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getUserInfo } from '../api/user.js'

export function Header() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()

  async function addTokens(token, userId, amount) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/${userId}/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  })
  if (!res.ok) throw new Error('Failed to add tokens')
  return await res.json()
}
  
  if (token) {
    const {sub} = jwtDecode(token)
    
    const { data: userInfo, refetch } = useQuery({
      queryKey: ['user', sub],
      queryFn: () => getUserInfo(sub),
    })

    const addTokensMutation = useMutation({
      mutationFn: (amount) => addTokens(token, sub, amount),
      onSuccess: () => {
        refetch()
        alert('Tokens added successfully!')
      },
      onError: (err) => alert('Failed to add tokens: ' + err.message)
    })

    const handleAddTokens = () => {
      const amount = prompt('How many tokens to add?', '100')
      if (amount && !isNaN(amount) && Number(amount) > 0) {
        addTokensMutation.mutate(Number(amount))
      }
    }
    
    return (
      <div>
        Hi! <User id={sub}/> | Tokens: {userInfo?.tokens ?? 0}
        <br />
         <button 
          onClick={() => navigate('/create-auction')}
          style={{ marginRight: 8 }}
        >Create Auction</button>
        <button onClick={() => navigate('/update-account')} style={{  marginRight: 8 }}>Update Account</button>
        <button onClick={() => setToken(null)}>Logout</button>
        <button onClick={handleAddTokens} style={{ marginLeft: 8 }}>+ Add Tokens</button>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
    </div>
  )
}