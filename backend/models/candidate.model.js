
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Hired', 'Rejected'],
    default: 'Pending'
  },
  resume_url: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
