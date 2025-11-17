import { Auction } from '../db/models/auction.js'

export async function createAuction(userId, { title, description, endTime }) {
  const auction = new Auction({
    title,
    description,
    endTime,
    author: userId
  })

  return await auction.save()
}
