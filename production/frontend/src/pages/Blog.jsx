import { useQuery } from '@tanstack/react-query'
import { fetchActiveAuctions } from '../api/auctions.js'
import { Header } from '../components/Header.jsx'
import { Link } from 'react-router-dom'
import '../css/auctions-list.css'

export function Blog() {
  const auctionsQuery = useQuery({
    queryKey: ['active-auctions'],
    queryFn: fetchActiveAuctions,
    refetchInterval: 30000, 
  })
  
  const activeAuctions = auctionsQuery.data ?? []

  // Calculate time remaining for each auction
  const getTimeRemaining = (endTime) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <>
      <Header />
      <div className="auctions-list-page">
        <div className="auctions-list-container">
          <div className="auctions-page-header">
            <h1>Live Auctions</h1>
            <p className="auctions-subtitle">Bid on exclusive items and collectibles</p>
          </div>

          {auctionsQuery.isLoading && (
            <div className="auctions-loading-state">
              <div className="auctions-spinner"></div>
              <p>Loading auctions...</p>
            </div>
          )}

          {auctionsQuery.error && (
            <div className="auctions-error-state">
              <p>❌ Error loading auctions. Please try again.</p>
            </div>
          )}

          {!auctionsQuery.isLoading && activeAuctions.length === 0 && (
            <div className="auctions-empty-state">
              <p>📭 No active auctions at the moment</p>
              <p className="auctions-empty-subtitle">Check back soon for new listings!</p>
            </div>
          )}

          <div className="auctions-list-grid">
            {activeAuctions.map(auction => (
              <Link 
                to={`/auctions/${auction._id}`} 
                key={auction._id} 
                className="auctions-list-card-link"
              >
                <article className="auctions-list-card">
                  <div className="auctions-card-header">
                    <h3 className="auctions-card-title">{auction.title}</h3>
                    <span className="auctions-status-badge">Live</span>
                  </div>
                  
                  <p className="auctions-card-description">{auction.description}</p>
                  
                  <div className="auctions-card-stats">
                    <div className="auctions-stat">
                      <span className="auctions-stat-label">Current Bid</span>
                      <span className="auctions-stat-value">{auction.currentBid} tokens</span>
                    </div>
                    <div className="auctions-stat">
                      <span className="auctions-stat-label">Time Left</span>
                      <span className="auctions-stat-value time">{getTimeRemaining(auction.endTime)}</span>
                    </div>
                  </div>

                  <div className="auctions-card-footer">
                    <span className="auctions-view-link">View Auction →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}