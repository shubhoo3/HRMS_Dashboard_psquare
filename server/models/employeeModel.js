import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

const Employee = mongoose.model('Employee', employeeSchema)

export default Employee
