import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAuction, placeBid, getBidHistory } from '../api/auctions'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'
import '../css/auction-detail.css'

async function deleteAuction(token, auctionId) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}auctions/${auctionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error("Failed to delete auction")
  return await res.json()
}

export function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [token, payload] = useAuth()
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const { data: auction, refetch } = useQuery({
    queryKey: ['auction', id],
    queryFn: () => getAuction(id),
    refetchInterval: 5000
  })

  const { data: bids, refetch: refetchBids } = useQuery({
    queryKey: ['bids', id],
    queryFn: () => getBidHistory(id),
    refetchInterval: 5000
  })

  const bidMutation = useMutation({
    mutationFn: () => placeBid(token, id, Number(bidAmount)),
    onSuccess: () => {
      refetch()
      refetchBids()
      setBidAmount('')
      alert('Bid placed successfully!')
    },
    onError: (err) => alert(err.message)
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteAuction(token, id),
    onSuccess: () => {
      alert('Auction deleted successfully!')
      navigate('/')
    },
    onError: (err) => alert('Failed to delete auction: ' + err.message)
  })

  useEffect(() => {
    if (!auction) return
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(auction.endTime)
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft('Ended')
        setIsExpired(true)
      } else {
        const days = Math.floor(diff / 86400000)
        const hours = Math.floor((diff % 86400000) / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${mins}m`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${mins}m ${secs}s`)
        } else {
          setTimeLeft(`${mins}m ${secs}s`)
        }
        setIsExpired(false)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [auction])

  const handleBidSubmit = (e) => {
    e.preventDefault()
    if (!bidAmount || Number(bidAmount) <= auction.currentBid) {
      alert(`Bid must be higher than current bid of ${auction.currentBid} tokens`)
      return
    }
    bidMutation.mutate()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      deleteMutation.mutate()
    }
  }

  // Check if current user is the auction creator
    const isCreator = payload && auction && payload.id === auction.author?._id

  if (!auction) return (
    <div className="auction-loading">
      <Header />
      <div className="spinner"></div>
    </div>
  )

  return (
    <>
      <Header />
      <div className="auction-detail-page">
        <div className="container">
          <div className="top-actions">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
            {isCreator && (
              <button 
                className="delete-btn" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : ' Delete Auction'}
              </button>
            )}
          </div>

          <div className="auction-layout">
            {/* Left Column - Main Info */}
            <div className="main-column">
              <div className="auction-header">
                <div>
                  <h1 className="auction-title">{auction.title}</h1>
                  <p className="auction-desc">{auction.description}</p>
                </div>
                <span className={`status-badge ${isExpired ? 'ended' : 'active'}`}>
                  {isExpired ? 'Ended' : 'Live'}
                </span>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Current Bid </span>
                  <span className="stat-value">{auction.currentBid}</span>
                  <span className="stat-unit"> tokens</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Time Left </span>
                  <span className="stat-value">{timeLeft}</span>
                </div>
              </div>

              {!isExpired ? (
                <div className="bid-form-container">
                  <h3 className="form-title">Place Bid</h3>
                  {!token ? (
                    <p className="auth-message">Sign in to place a bid</p>
                  ) : isCreator ? (
                    <p className="auth-message">You cannot bid on your own auction</p>
                  ) : (
                    <form onSubmit={handleBidSubmit} className="bid-form">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={auction.currentBid + 1}
                        min={auction.currentBid + 1}
                        className="bid-input"
                      />
                      <button 
                        type="submit" 
                        disabled={bidMutation.isPending || !bidAmount}
                        className="bid-btn"
                      >
                        {bidMutation.isPending ? 'Placing...' : 'Place Bid'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="ended-banner">
                  <h3>Auction Ended</h3>
                  {bids && bids.length > 0 && (
                    <p>Winner: <strong>{bids[0].user.username}</strong> ({bids[0].amount} tokens)</p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Bid History */}
            <div className="sidebar">
              <h3 className="sidebar-title">Bid History</h3>
              
              {!bids || bids.length === 0 ? (
                <div className="empty-state">
                  <p>No bids yet</p>
                </div>
              ) : (
                <>
                  <div className="bid-list">
                    {bids.map((bid, index) => (
                      <div key={bid._id} className={`bid-entry ${index === 0 ? 'top-bid' : ''}`}>
                        <div className="bid-info">
                          <span className="bid-user">
                            {bid.user.username}
                          </span>
                          <span className="bid-time">
                            {new Date(bid.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="bid-value">{bid.amount} tokens</span>
                      </div>
                    ))}
                  </div>

                  <div className="bid-summary">
                    <div className="summary-item">
                      <span>Total Bids</span>
                      <strong>{bids.length}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Starting</span>
                      <strong>{Math.min(...bids.map(b => b.amount))} tokens</strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}