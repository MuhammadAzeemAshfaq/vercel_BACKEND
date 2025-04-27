const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { generateToken, verifyToken } = require('../utils/auth');
const User = require('../models/User');

exports.login = async (req, res, next) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ success, errors: [{ msg: 'Invalid credentials' }] });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ success, errors: [{ msg: 'Invalid credentials' }] });
            }

            const token = generateToken(user.id, user.isAdmin);

            success = true;
            res.status(200).json({
                success,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        isAdmin: user.isAdmin
                    }
                }
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password, newPassword } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ success, errors: [{ msg: 'Invalid credentials' }] });
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password);

            if (!isCorrectPassword) {
                return res.status(400).json({ success, errors: [{ msg: 'Invalid credentials' }] });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedNewPassword;
            await user.save();

            success = true;
            res.status(200).json({ success, msg: 'Password updated successfully' });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    } catch (error) {
        next(error);
    }
};

exports.verifySession = async (req, res, next) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { token } = req.body;
        const decoded = verifyToken(token);

        if (decoded) {
            success = true;
            return res.status(200).json({ success, data: decoded });
        } else {
            return res.status(400).json({ success, message: 'Invalid token' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success, message: 'Server Error' });
    }
};
