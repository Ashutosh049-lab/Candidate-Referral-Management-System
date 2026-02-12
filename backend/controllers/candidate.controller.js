
const Candidate = require('../models/candidate.model');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create({
      ...req.body,
      resume_url: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getCandidates = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { job_title: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const candidates = await Candidate.find(query);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // delete resume file
    if (candidate.resume_url) {
      const filePath = path.join(__dirname, '..', candidate.resume_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await candidate.deleteOne();

    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// METRICS
exports.getMetrics = async (req, res) => {
  try {
    const total = await Candidate.countDocuments();
    const pending = await Candidate.countDocuments({ status: 'Pending' });
    const reviewed = await Candidate.countDocuments({ status: 'Reviewed' });
    const hired = await Candidate.countDocuments({ status: 'Hired' });
    const rejected = await Candidate.countDocuments({ status: 'Rejected' });

    res.json({
      total,
      by_status: { Pending: pending, Reviewed: reviewed, Hired: hired, Rejected: rejected }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
