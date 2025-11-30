import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { signup } from '../api/user.js'
import {useNavigate, Link} from 'react-router-dom'
import '../css/login.css';


export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: () => signup({ username, password }),
    onSuccess: () => navigate('/login'),
    onError: () => alert('Failed to sign up!')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    signupMutation.mutate()
  }

  const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/google'
    }

   return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Create an account</h1>
        <div className="signup-prompt">
          <span>Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>

        <div className="form-group">
          <input
            type="text"
            id="create-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="create-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="continue-btn"
          disabled={!username || !password || signupMutation.isPending}
        >
          {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
        </button>

        <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    className="google-btn"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                    />
                    Create account with Google
                </button>
      </form>
    </div>
  )
}