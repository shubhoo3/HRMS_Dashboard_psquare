import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// Protect routes - verify JWT
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')

      // Fetch the user (excluding password)
      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        res.status(401)
        throw new Error('User not found')
      }

      req.user = user  // 👈 Set full user object
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

// Admin-only middleware
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)  // 403 = Forbidden
    throw new Error('Not authorized as an admin')
  }
})
