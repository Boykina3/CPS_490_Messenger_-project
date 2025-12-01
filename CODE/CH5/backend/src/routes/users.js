import { createUser, loginUser, getUserInfoById } from '../services/users.js'
import { requireAuth } from '../middleware/jwt.js'
import { User } from '../db/models/user.js'
import { Post } from '../db/models/post.js'
import bcrypt from 'bcrypt'

export function userRoutes(app) {
  app.get('/api/v1/user/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).json(userInfo)
  })
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json(user)
    } catch (err) {
      return res.status(400).send({
        error: 'Failed to create the user. Does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return res.status(400).send({
        error: 'Failed to log in user — check username or password.',
      })
    }
  })

  app.post('/api/v1/user/:id/tokens', requireAuth, async (req, res) => {
    try {
      if (req.auth.sub !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      const { amount } = req.body
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' })
      }

      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      user.tokens += amount
      await user.save()

      return res.status(200).json({ 
        message: 'Tokens added successfully',
        tokens: user.tokens 
      })
    } catch (err) {
      console.error('Error adding tokens:', err)
      return res.status(500).json({ error: 'Failed to add tokens' })
    }
  })

  app.put('/api/v1/user/:id', requireAuth, async (req, res) => {
    try {
      if (req.auth.sub !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized to update this account.' })
      }

      const { username, password } = req.body
      const updates = {}

      if (username) updates.username = username
      if (password) updates.password = await bcrypt.hash(password, 10)

      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      if (!user) return res.status(404).json({ error: 'User not found.' })

      return res.status(200).json({
        message: 'Account updated successfully.',
        user: { username: user.username, _id: user._id },
      })
    } catch (err) {
      console.error('Error updating user:', err)
      return res.status(500).json({ error: 'Failed to update account.' })
    }
  })

  app.delete('/api/v1/user/:id', requireAuth, async (req, res) => {
    try {
      if (req.auth.sub !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized to delete this account.' })
      }

      const deletedUser = await User.findByIdAndDelete(req.params.id)
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' })
      }

      await Post.deleteMany({ author: req.params.id })

      return res.status(200).json({ message: 'Account deleted successfully.' })
    } catch (err) {
      console.error('Error deleting user:', err)
      return res.status(500).json({ error: 'Failed to delete account.' })
    }
  })
}

