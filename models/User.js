const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true, 'Please add name'],
            trim: true
        },
        username : {
            type: String,
            required: [true, 'Please add username'],
            unique: true,
            trim: true,
        },
        email : {
            type: String,
            required: [true, 'Please add email'],
            unique: true,
            trim: true,
        },
        password :{
            type: String,
            required: [true,'Please add password'],
            min: 6,
            max: 64
        },
    },{timestamps: true}
);

module.exports = mongoose.model('User', userSchema)