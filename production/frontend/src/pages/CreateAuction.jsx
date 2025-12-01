import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export function CreateAuction() {
  const [token] = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endTime, setEndTime] = useState('')
  const [startingBid, setStartingBid] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}auctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, startingBid, endTime })
    })

    if (res.ok) {
      alert('Auction created!')
      navigate('/')  
    } else {
      alert('Error creating auction')
    }
  }

  if (!token) return <div>Please log in to create auctions.</div>

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Auction Item</h2>

      <button 
        type="button" 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back to main page
      </button>

      <br /><br />

      <label htmlFor="title">Title:</label><br/>
      <input 
        id="title"
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      /><br/><br/>

      <label htmlFor="description">Description:</label><br/>
      <textarea 
        id="description"
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      /><br/><br/>

      <label htmlFor="startingBid">Starting Bid (tokens):</label><br/>
      <input 
        id="startingBid"
        type="number"
        value={startingBid} 
        onChange={(e) => setStartingBid(Number(e.target.value))} 
        min="0"
      /><br/><br/>

      <label htmlFor="endTime">End Date & Time:</label><br/>
      <input 
        id="endTime"
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      /><br/><br/>

      <button type="submit">Create Auction</button>
    </form>
  )
}
