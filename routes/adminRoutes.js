const express = require('express');
const { check } = require('express-validator');
const { registerAdmin, updateAdmin, getAdmin, getHostel, deleteAdmin } = require('../controllers/adminController');
const router = express.Router();

//=========================
router.post('/register-admin', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('father_name', 'Father name is required').not().isEmpty(),
    check('contact', 'Enter a valid contact number').isLength(11),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('cnic', 'CNIC is required').isLength(13),
    check('password', 'Password is required').isLength(8)
], registerAdmin);

//===========================
router.post('/update-admin', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('contact', 'Enter a valid contact number').isLength(11),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('cnic', 'CNIC is required').isLength(13),
    check('hostel', 'Hostel is required').not().isEmpty(),
    check('password', 'Password is required').isLength(8)
], updateAdmin);

//===================
router.post('/get-admin', [
    check('isAdmin', 'isAdmin is required').notEmpty(),
    check('token', 'Token is required').notEmpty(),
], getAdmin);

//=====================
router.post('/get-hostel', [
    check('id', 'Id is required').notEmpty(),
], getHostel);

//======================
router.post('/delete-admin', [
    check('email', 'Please include a valid email').isEmail()
], deleteAdmin);

module.exports = router;