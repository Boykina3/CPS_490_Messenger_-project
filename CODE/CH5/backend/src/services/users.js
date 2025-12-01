import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('Invalid username!')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('Invalid password!')
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  })

  return token
}

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })
  return await user.save()
}
export async function getUserInfoById(userId) {
  try{
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username, tokens: user.tokens }
  } catch (err) {
    return {username: userId}
  }
}
export async function updateUser(userId, { username, password }) {
  const updateData = {}
  if (username) updateData.username = username
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    updateData.password = hashedPassword
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  )

  if (!user) throw new Error('User not found')
  return { username: user.username, id: user._id }
}
export async function addTokens(token, userId, amount) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/${userId}/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  })
  if (!res.ok) throw new Error('Failed to add tokens')
  return await res.json()
}
