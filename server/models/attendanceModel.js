import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employee'
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  task: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Attendance = mongoose.model('Attendance', attendanceSchema)

export default Attendance
