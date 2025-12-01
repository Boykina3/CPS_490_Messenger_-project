import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
   startingBid: {
    type: Number,
    required: true,
    default: 0
  },
   currentBid: {
    type: Number,
    required: true,
    default: 0
   },
  endTime: {
    type: Date,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true })

export const Auction = mongoose.model('Auction', auctionSchema)
