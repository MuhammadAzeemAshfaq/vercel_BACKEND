const { generateToken, verifyToken } = require('../utils/auth');
const { validationResult } = require('express-validator');
const { Admin, User, Hostel } = require('../models');
const bcrypt = require('bcryptjs');

const registerAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { name, email, father_name, contact, address, dob, cnic, hostel, password } = req.body;

        try {
            let existingAdmin = await Admin.findOne({ email });

            if (existingAdmin) {
                return res.status(400).json({ success, errors: [{ msg: 'Admin already exists' }] });
            }

            const associatedHostel = await Hostel.findOne({ name: hostel });

            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password: encryptedPassword,
                isAdmin: true
            });

            await newUser.save();

            const newAdmin = new Admin({
                name,
                email,
                father_name,
                contact,
                address,
                dob,
                cnic,
                user: newUser.id,
                hostel: associatedHostel.id
            });

            await newAdmin.save();

            const token = generateToken(newUser.id, newUser.isAdmin);
            success = true;

            res.json({ success, token, admin: newAdmin });

        } catch (err) {
            res.status(500).send('Server Error');
        }
    } catch (err) {
        res.status(500).json({ success, errors: [{ msg: 'Server Error' }] });
    }
};

const updateAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { name, email, father_name, contact, address, dob, cnic } = req.body;

        try {
            const adminToUpdate = await Admin.findOne({ email });

            if (!adminToUpdate) {
                return res.status(400).json({ success, errors: [{ msg: 'Admin does not exist' }] });
            }

            adminToUpdate.name = name;
            adminToUpdate.email = email;
            adminToUpdate.father_name = father_name;
            adminToUpdate.contact = contact;
            adminToUpdate.address = address;
            adminToUpdate.dob = dob;
            adminToUpdate.cnic = cnic;

            await adminToUpdate.save();
            success = true;

            res.json({ success, admin: adminToUpdate });

        } catch (err) {
            res.status(500).send('Server Error');
        }
    } catch (err) {
        res.status(500).json({ success, errors: [{ msg: 'Server Error' }] });
    }
};

const getHostel = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { id } = req.body;

        const adminData = await Admin.findById(id);

        if (!adminData) {
            return res.status(400).json({ success, errors: [{ msg: 'Admin not found' }] });
        }

        const hostelDetails = await Hostel.findById(adminData.hostel);

        success = true;
        res.json({ success, hostel: hostelDetails });

    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const getAdmin = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { isAdmin, token } = req.body;

        if (!isAdmin) {
            return res.status(401).json({ success, errors: [{ msg: 'Access denied: Not an Admin' }] });
        }

        if (!token) {
            return res.status(401).json({ success, errors: [{ msg: 'No token provided' }] });
        }

        const decodedData = verifyToken(token);

        if (!decodedData) {
            return res.status(401).json({ success, errors: [{ msg: 'Invalid token' }] });
        }

        const adminInfo = await Admin.findOne({ user: decodedData.userId }).select('-password');

        if (!adminInfo) {
            return res.status(401).json({ success, errors: [{ msg: 'Invalid token' }] });
        }

        success = true;
        res.json({ success, admin: adminInfo });

    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const deleteAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email } = req.body;

        const adminRecord = await Admin.findOne({ email });

        if (!adminRecord) {
            return res.status(400).json({ success, errors: [{ msg: 'Admin not found' }] });
        }

        const userRecord = await User.findById(adminRecord.user);

        await User.deleteOne(userRecord);
        await Admin.deleteOne(adminRecord);

        success = true;
        res.json({ success, msg: 'Admin successfully deleted' });

    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    registerAdmin,
    updateAdmin,
    getAdmin,
    getHostel,
    deleteAdmin
};
