import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateUser } from '../api/user.js'
import { useAuth } from '../context/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'

export function UpdateAccount() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()
  const { sub: userId } = jwtDecode(token)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => updateUser(userId, { username, password, token }),
    onSuccess: () => {
      alert('Account updated successfully!')
      navigate('/')
    },
    onError: () => alert('Failed to update account'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account?')) return
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert('Account deleted successfully.')
        setToken(null) 
        window.location.href = '/'
      } else {
        alert('Failed to delete account.')
      }
    } catch (err) {
      console.error('Error deleting account:', err)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Back to Blog</Link>
      <h2>Update Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">New Username:</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>
        <br />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Update Account'}
        </button>
      </form>

      <hr />
      <h3>Delete Account</h3>
      <p style={{ color: 'red' }}>Warning: This action cannot be undone.</p>
      <button
        onClick={handleDeleteAccount}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '0.5em 1em',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Delete My Account
      </button>
    </div>
  )
}
