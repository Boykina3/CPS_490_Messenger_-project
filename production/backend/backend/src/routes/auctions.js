import { requireAuth } from '../middleware/jwt.js'
import { createAuction, getAuction, placeBid, getBidHistory } from '../services/auctions.js'
import { Auction } from '../db/models/auction.js'

export function auctionRoutes(app) {

  app.get('/api/v1/auctions/active', async (req, res) => {
  try {
    const now = new Date()
    const activeAuctions = await Auction.find({
      endTime: { $gt: now }   
    }).sort({ endTime: 1 })   
    res.status(200).json(activeAuctions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch active auctions" })
  }
})

app.get('/api/v1/auctions/:id', async (req, res) => {
    try {
      const auction = await getAuction(req.params.id)
      res.status(200).json(auction)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to fetch auction" })
    }
  })

  app.post('/api/v1/auctions', requireAuth, async (req, res) => {
    try {
      const auction = await createAuction(req.auth.sub, req.body)
      return res.status(201).json(auction)
    } catch (err) {
      console.error('Error creating auction:', err)
      return res.status(500).json({ error: 'Failed to create auction' })
    }
  })

  app.delete('/api/v1/auctions/:id', requireAuth, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' })
    }
    
    // Check if user is the author 
    if (auction.author.toString() !== req.auth.sub) {
      return res.status(403).json({ error: 'Not authorized to delete this auction' })
    }
    
    await Auction.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Auction deleted successfully' })
  } catch (err) {
    console.error('Error deleting auction:', err)
    res.status(500).json({ error: 'Failed to delete auction' })
  }
})

app.post('/api/v1/auctions/:id/bid', requireAuth, async (req, res) => {
    try {
      const result = await placeBid(req.params.id, req.auth.sub, req.body.amount)
      res.status(200).json(result)
    } catch (err) {
      console.error('Error placing bid:', err)
      res.status(400).json({ error: err.message })
    }
  })

  app.get('/api/v1/auctions/:id/bids', async (req, res) => {
    try {
      const bids = await getBidHistory(req.params.id)
      res.status(200).json(bids)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to fetch bid history" })
    }
  })
}
