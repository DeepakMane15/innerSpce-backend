const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    firstName:
    {
        type: String,
        required: true,
        trim: true
    },
    lastName:
    {
        type: String,
        required: false,
        trim: true
    },
    userName: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: false,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    }
},
    { timestamp: true });

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Users', userSchema)