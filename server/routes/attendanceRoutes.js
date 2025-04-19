import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'
import Attendance from '../models/attendanceModel.js'

const router = express.Router()

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { date } = req.query

  let records = []

  if (date) {
    records = await Attendance.find({ date })
  } else {
    records = await Attendance.find({})
  }

  res.json(records)
}))

// @desc    Create new attendance record
// @route   POST /api/attendance
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { employeeId, date, status, task } = req.body

  if (!employeeId || !date || !status) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  // Check if record already exists
  const existingRecord = await Attendance.findOne({ employeeId, date })

  if (existingRecord) {
    existingRecord.status = status
    existingRecord.task = task || ''
    await existingRecord.save()
    return res.json(existingRecord)
  }

  const newRecord = await Attendance.create({
    employeeId,
    date,
    status,
    task
  })

  res.status(201).json(newRecord)
}))

// @desc    Get attendance for a specific employee
// @route   GET /api/attendance/employee/:id
// @access  Private
router.get('/employee/:id', protect, asyncHandler(async (req, res) => {
  const employeeAttendance = await Attendance.find({ employeeId: req.params.id })
  res.json(employeeAttendance)
}))

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { status, task } = req.body

  const record = await Attendance.findById(req.params.id)

  if (!record) {
    res.status(404)
    throw new Error('Attendance record not found')
  }

  record.status = status || record.status
  record.task = task !== undefined ? task : record.task
  const updated = await record.save()

  res.json(updated)
}))

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id)

  if (!record) {
    res.status(404)
    throw new Error('Attendance record not found')
  }

  await record.remove()
  res.json({ message: 'Attendance record removed' })
}))

export default router
