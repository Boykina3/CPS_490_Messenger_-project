import { Link, useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode' 
import { useAuth } from '../context/AuthContext.jsx' 
import {User} from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()
  if (token) {
    const {sub} = jwtDecode(token) 
    return (
      <div>
        Hi! <INput:date></INput:date> <User id={sub}/>
        <br />
        <button onClick={() => navigate('/update-account')} style={{  marginRight: 8 }}>Update Account</button>
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
    </div>
  )
}
