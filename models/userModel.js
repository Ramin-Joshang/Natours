const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name ,email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email field is required"],
        unique: [true, "this Email has already existed"],
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, "Password confirm field is required"],
        validate: {
            // * This only works on create and save!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Password are not the same!"
        }
    }
});


userSchema.pre("save", async function (next) {
    console.log('hi')
    if (!this.isModified('password')) return next();
    console.log("hello")
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;