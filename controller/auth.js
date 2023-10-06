const userSchema = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const signUp = async (req, res) => {
    try {
        const User = new userSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
            role: req.body.role
        })

        userSchema.findOne({ userName: req.body.userName })
            .then(async function (user, error) {
                if (user) {
                    return res.send({
                        status: 205,
                        message: "user already registered",
                        process: 'signUp'
                    });
                }
                await User.save().then((user) => {
                    return res.send({
                        status: 200,
                        message: "signed up successfully",
                        data: user
                    })
                })
                    .catch((err) => {
                        return res.send({
                            status: 400, message: err, process: 'signUp'
                        });
                    })
            })
            .catch((err) => {
                res.send({ status: 400, message: err, process: 'signUp' })
            })

    }
    catch (err) {
        res.send({ status: 400, message: err, process: process })
    }
}

const signIn = async (req, res) => {
    try {
        const { userName, password } = req.body;
        userSchema.findOne({ userName: userName })
            .then(async function (user, error) {
                if (error) throw error;
                if (user) {
                    const isMatch = await user.comparePassword(password);
                    console.log(isMatch)
                    if (isMatch) {
                        // Passwords match, user is authenticated
                        const token = jwt.sign({
                            data: user
                        }, process.env.JWT_SECRET, { expiresIn: '365d' });
                        return res.send({
                            status: 200,
                            token: token,
                            data: user,
                            message: "Logged in successfully",
                            process: 'signIn'
                        });
                    } else {
                        // Passwords do not match
                        return res.send({
                            status: 400,
                            message: "Invalid password",
                            process: 'signIn'
                        });
                    }
                }
                else {
                    return res.send({
                        status: 400,
                        message: "User does not exist",
                        process: 'signIn'
                    });
                }
            })
            .catch((err) => {
                res.send({ status: 400, message: err.message, process: 'signIn' })
            })

    }
    catch (err) {
        res.send({ status: 400, data: err.message, process: 'signIn' })
    }
}

const signOut = async (req, res) => {
    try {
        userSchema.findOneAndUpdate({ _id: req.params.id }, { active: 0, lastSeen: Date.now() })
            .then(async function (user, error) {
                if (user) {
                    return res.send({
                        status: 200,
                        data: user,
                        message: "Logged out successfully",
                        process: 'signOut'
                    });
                }
                if (!user) {
                    return res.send({
                        status: 205,
                        message: "User does not exist with that id",
                        process: 'signOut'
                    });
                }
            })
            .catch((err) => {
                res.send({ status: 400, message: err, process: 'signOut' })
            })

    }
    catch (err) {
        res.send({ status: 400, data: err, process: 'signOut' })
    }
}




module.exports = { signUp, signIn, signOut }