import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import {postsRoutes} from './routes/posts.js'
import {userRoutes} from './routes/users.js'
import { auctionRoutes } from './routes/auctions.js'

const app = express()
app.use(bodyParser.json())


//SESSION SETUP
app.use(
  session({
    secret: 'supersecret', 
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

//GOOGLE AUTH  
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google user:', profile.displayName)
      return done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  next()
})

//GOOGLE AUTH ROUTES
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  async (req, res) => {
    console.log('Google profile:', req.user)
    console.log('Emails:', req.user.emails)
    
    const { User } = await import('./db/models/user.js')
    let user = await User.findOne({ username: req.user.emails[0].value })
    
    if (!user) {
      user = new User({
        username: req.user.emails[0].value,
        password: 'google-oauth-user', 
        tokens: 100
      })
      await user.save()
    }
    
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET || 'your-secret-key')
    console.log('Generated token:', token)
    res.redirect(`http://localhost:5173/?token=${token}`)
  }
)

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/')
  })
})

postsRoutes(app)
userRoutes(app)
auctionRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello from Express!')
})

export {app}
