import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema({
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
  status: {
    type: String,
    default: 'New'
  },
  resume: {
    type: String
  }
}, {
  timestamps: true
})

const Candidate = mongoose.model('Candidate', candidateSchema)

export default Candidate
