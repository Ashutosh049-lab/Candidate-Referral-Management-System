
const express = require('express');
const router = express.Router();
const {
  createCandidate,
  getCandidates,
  updateStatus,
  deleteCandidate,
  getMetrics
} = require('../controllers/candidate.controller');

const upload = require('../middleware/upload.middleware');

router.post('/', upload.single('resume'), createCandidate);
router.get('/', getCandidates);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteCandidate);
router.get('/metrics', getMetrics);

module.exports = router;
