import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'
import Employee from '../models/employeeModel.js'

const router = express.Router()

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const employees = await Employee.find({})
  res.json(employees)
}))

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { fullName, email, phone, position, department, dateOfJoining } = req.body

  if (!fullName || !email || !position || !department || !dateOfJoining) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const employee = await Employee.create({
    fullName,
    email,
    phone,
    position,
    department,
    dateOfJoining
  })

  res.status(201).json(employee)
}))

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)

  if (employee) {
    res.json(employee)
  } else {
    res.status(404)
    throw new Error('Employee not found')
  }
}))

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { fullName, email, phone, position, department, dateOfJoining } = req.body

  const employee = await Employee.findById(req.params.id)

  if (!employee) {
    res.status(404)
    throw new Error('Employee not found')
  }

  employee.fullName = fullName || employee.fullName
  employee.email = email || employee.email
  employee.phone = phone || employee.phone
  employee.position = position || employee.position
  employee.department = department || employee.department
  employee.dateOfJoining = dateOfJoining || employee.dateOfJoining

  const updatedEmployee = await employee.save()
  res.json(updatedEmployee)
}))

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)

  if (!employee) {
    res.status(404)
    throw new Error('Employee not found')
  }

  await employee.remove()
  res.json({ message: 'Employee removed' })
}))

export default router
