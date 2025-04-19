import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

const router = express.Router()

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '2h'
  })
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}))

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
}))

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}))

// @desc    Refresh token
// @route   POST /api/users/refresh-token
// @access  Public
router.post('/refresh-token', asyncHandler(async (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(401)
    throw new Error('No token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123', { ignoreExpiration: true })
    const user = await User.findById(decoded.id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const newToken = generateToken(user._id)
    res.json({ token: newToken })
  } catch (error) {
    console.error(error)
    res.status(401)
    throw new Error('Invalid token')
  }
}))

export default router
