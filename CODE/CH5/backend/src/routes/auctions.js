import { requireAuth } from '../middleware/jwt.js'
import { createAuction } from '../services/auctions.js'

export function auctionRoutes(app) {

  // Create new auction item
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
