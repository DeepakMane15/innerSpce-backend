const userSchema = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const signUp = async (req, res) => {
    try {
        const User = new userSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password
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
        userSchema.findOne({ userName: req.body.userName, password: req.body.password })
            .then(async function (user, error) {
                if (user) {
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
                }
                if (!user) {
                    return res.send({
                        status: 400,
                        message: "Invalid username or password",
                        process: 'signIn'
                    });
                }
            })
            .catch((err) => {
                res.send({ status: 400, message: err, process: 'signIn' })
            })

    }
    catch (err) {
        res.send({ status: 400, data: err, process: 'signIn' })
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