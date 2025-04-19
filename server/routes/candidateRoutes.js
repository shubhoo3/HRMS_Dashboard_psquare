import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'
import Candidate from '../models/candidateModel.js'

const router = express.Router()

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const candidates = await Candidate.find({})
  res.json(candidates)
}))

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { fullName, email, phone, position, status, resume } = req.body

  if (!fullName || !email || !position) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const candidate = await Candidate.create({
    fullName,
    email,
    phone,
    position,
    status: status || 'New',
    resume
  })

  res.status(201).json(candidate)
}))

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id)

  if (candidate) {
    res.json(candidate)
  } else {
    res.status(404)
    throw new Error('Candidate not found')
  }
}))

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { fullName, email, phone, position, status, resume } = req.body

  const candidate = await Candidate.findById(req.params.id)

  if (!candidate) {
    res.status(404)
    throw new Error('Candidate not found')
  }

  candidate.fullName = fullName || candidate.fullName
  candidate.email = email || candidate.email
  candidate.phone = phone || candidate.phone
  candidate.position = position || candidate.position
  candidate.status = status || candidate.status
  candidate.resume = resume || candidate.resume

  const updatedCandidate = await candidate.save()
  res.json(updatedCandidate)
}))

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id)

  if (!candidate) {
    res.status(404)
    throw new Error('Candidate not found')
  }

  await candidate.remove()
  res.json({ message: 'Candidate removed' })
}))

export default router
