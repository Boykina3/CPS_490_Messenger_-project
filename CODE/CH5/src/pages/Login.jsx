import {useState, useEffect} from 'react'
import {useMutation} from '@tanstack/react-query'
import {useNavigate, Link} from 'react-router-dom'
import {login} from '../api/user'
import {useAuth} from '../context/AuthContext'
import '../css/login.css';

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [token, setToken] = useAuth()

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    const loginMutation = useMutation({
        mutationFn: () => login({username, password}),
        onSuccess: (data) => {
            setToken(data.token)
            navigate('/')
        },
        onError: () => alert('failed to login!')
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        loginMutation.mutate()
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/google'
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Sign in to your account</h1>
                
                <div className="signup-prompt">
                    <span>New here? </span>
                    <Link to='/signup'>Create account</Link>
                </div>

                <div className="form-group">
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className="form-group">
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <button 
                    type='submit'
                    className="continue-btn"
                    disabled={!username || !password || loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Signing in...' : 'Continue'}
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
                    Sign in with Google
                </button>
            </form>
        </div>
    )
}