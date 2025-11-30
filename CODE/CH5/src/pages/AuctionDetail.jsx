import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAuction, placeBid, getBidHistory } from '../api/auctions'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useNavigate } from 'react-router-dom'

export function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [token] = useAuth()
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState('')

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

  useEffect(() => {
    if (!auction) return
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(auction.endTime)
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft('Auction ended')
      } else {
        const hours = Math.floor(diff / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`${hours}h ${mins}m ${secs}s`)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [auction])

  if (!auction) return <div>Loading...</div>

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br></br>
      <button onClick={() => navigate('/')}>Back to Auctions</button>
      <br /><br /><br />
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <h3>Time Remaining: {timeLeft}</h3>
      <h3>Current Bid: {auction.currentBid} tokens</h3>

      <form onSubmit={(e) => { e.preventDefault(); bidMutation.mutate() }}>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount"
          min={auction.currentBid + 1}
        />
        <button type="submit" disabled={!token || bidMutation.isPending}>
          Place Bid
        </button>
      </form>

      <h3>Bid History</h3>
      <ul>
        {bids?.map(bid => (
          <li key={bid._id}>
            {bid.user.username} - {bid.amount} tokens - {new Date(bid.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}