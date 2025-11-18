import { requireAuth } from '../middleware/jwt.js'
import { createAuction } from '../services/auctions.js'

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
  app.post('/api/v1/auctions', requireAuth, async (req, res) => {
    try {
      const auction = await createAuction(req.auth.sub, req.body)
      return res.status(201).json(auction)
    } catch (err) {
      console.error('Error creating auction:', err)
      return res.status(500).json({ error: 'Failed to create auction' })
    }
  })
}
