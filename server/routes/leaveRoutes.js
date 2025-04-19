import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'
import Leave from '../models/leaveModel.js'

const router = express.Router()

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const status = req.query.status
  let leaves

  if (status) {
    leaves = await Leave.find({ status })
  } else {
    leaves = await Leave.find()
  }

  res.json(leaves)
}))

// @desc    Create new leave request
// @route   POST /api/leaves
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { employeeId, startDate, endDate, reason, type } = req.body

  if (!employeeId || !startDate || !endDate || !reason || !type) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const leave = await Leave.create({
    employeeId,
    startDate,
    endDate,
    reason,
    type
  })

  res.status(201).json(leave)
}))

// @desc    Get leave requests for a specific employee
// @route   GET /api/leaves/employee/:id
// @access  Private
router.get('/employee/:id', protect, asyncHandler(async (req, res) => {
  const employeeLeaves = await Leave.find({ employeeId: req.params.id })
  res.json(employeeLeaves)
}))

// @desc    Update leave request status
// @route   PUT /api/leaves/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { status } = req.body

  const leave = await Leave.findById(req.params.id)

  if (!leave) {
    res.status(404)
    throw new Error('Leave request not found')
  }

  leave.status = status || leave.status
  leave.updatedAt = new Date()

  const updatedLeave = await leave.save()
  res.json(updatedLeave)
}))

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id)

  if (!leave) {
    res.status(404)
    throw new Error('Leave request not found')
  }

  await leave.remove()
  res.json({ message: 'Leave request removed' })
}))

export default router
