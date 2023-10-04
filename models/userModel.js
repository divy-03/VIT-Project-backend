const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter an Email"],
    unique: [true, "Email already exist"],
    validate: [validator.isEmail, "Invalid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your paasword"],
    minLength: [8, "Password should have more than 8 charactersS"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

module.exports = mongoose.model("User", userSchema);
