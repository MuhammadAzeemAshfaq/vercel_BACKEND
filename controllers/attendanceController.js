const { validationResult } = require('express-validator');
const { Student, Attendance } = require('../models');

const markAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }

    const { student, status } = req.body;
    const today = new Date();

    const existingRecord = await Attendance.findOne({
        student,
        date: {
            $gte: today.setHours(0, 0, 0, 0),
            $lt: today.setHours(23, 59, 59, 999)
        }
    });

    if (existingRecord) {
        return res.status(409).json({ success, error: 'Attendance already recorded for today' });
    }

    try {
        const newAttendance = new Attendance({ student, status });
        const savedAttendance = await newAttendance.save();
        success = true;
        res.status(201).json({ success, savedAttendance });
    } catch (error) {
        res.status(500).json({ success, error: error.message });
    }
};

const getAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }

    const { student } = req.body;

    try {
        const attendanceRecords = await Attendance.find({ student });
        success = true;
        res.status(200).json({ success, attendance: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success, error: error.message });
    }
};

const updateAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { student, status } = req.body;

    try {
        const updatedRecord = await Attendance.findOneAndUpdate(
            { student, date: Date.now() },
            { status },
            { new: true }
        );
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHostelAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }

    const { hostel } = req.body;

    try {
        const currentDate = new Date();
        const hostelStudents = await Student.find({ hostel });

        const hostelAttendance = await Attendance.find({
            student: { $in: hostelStudents },
            date: {
                $gte: currentDate.setHours(0, 0, 0, 0),
                $lt: currentDate.setHours(23, 59, 59, 999)
            }
        }).populate('student', ['_id', 'name', 'room_no', 'cms_id']);

        success = true;
        res.status(200).json({ success, attendance: hostelAttendance });
    } catch (error) {
        res.status(500).json({ success, error: error.message });
    }
};

module.exports = {
    markAttendance,
    getAttendance,
    updateAttendance,
    getHostelAttendance
};
