import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
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
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/dashboard', // redirect to your frontend dashboard
    failureRedirect: 'http://localhost:5173/login',
  })
)

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/')
  })
})

postsRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello from Express!')
})

export {app}
auctionRoutes(app)