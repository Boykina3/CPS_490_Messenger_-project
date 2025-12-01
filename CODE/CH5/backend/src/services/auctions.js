import { Auction } from '../db/models/auction.js'
import { Bid } from '../db/models/bid.js'
import { User } from '../db/models/user.js'

export async function createAuction(userId, { title, description, endTime, startingBid }) {
  const auction = new Auction({
    title,
    description,
    endTime,
    startingBid: startingBid || 0,
    currentBid: startingBid || 0,
    author: userId
  })

  return await auction.save()
}

export async function getAuction(auctionId) {
  return await Auction.findById(auctionId).populate('author', 'username')
}

export async function placeBid(auctionId, userId, amount) {
  const auction = await Auction.findById(auctionId)
  const user = await User.findById(userId)

  if (!auction) throw new Error('Auction not found')
  if (auction.status === 'ended') throw new Error('Auction has ended')
  if (new Date() > auction.endTime) throw new Error('Auction time expired')
  if (amount <= auction.currentBid) throw new Error('Bid must be higher than current bid')

  const previousBid = await Bid.findOne({ auction: auctionId })
    .sort({ createdAt: -1 })
    .limit(1)

  if (previousBid && previousBid.user.toString() !== userId) {
    const previousBidder = await User.findById(previousBid.user)
    if (previousBidder) {
      previousBidder.tokens += previousBid.amount
      await previousBidder.save()
    }
  }

  if (previousBid && previousBid.user.toString() === userId) {
    user.tokens += previousBid.amount
  }

  if (user.tokens < amount) throw new Error('Insufficient tokens')

  user.tokens -= amount
  await user.save()

  auction.currentBid = amount
  await auction.save()

  const bid = new Bid({ auction: auctionId, user: userId, amount })
  await bid.save()

  return { auction, bid }
}

export async function getBidHistory(auctionId) {
  return await Bid.find({ auction: auctionId })
    .populate('user', 'username')
    .sort({ createdAt: -1 })
}