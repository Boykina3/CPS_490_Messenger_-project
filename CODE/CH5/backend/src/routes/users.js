import { createUser, loginUser, getUserInfoById } from '../services/users.js'

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
        error: 'Failed to create the user. Does the username already exist?'
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return res.status(400).send({
        error: 'Failed to log in user — check username or password.'
      })
    }
  })
}
