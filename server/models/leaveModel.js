import mongoose from 'mongoose'

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected']
  },
  appliedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Leave = mongoose.model('Leave', leaveSchema)

export default Leave
