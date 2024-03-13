const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    profilePic: { type: String, trim: true },
    favGames: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Boardgame'
      }
    ],
    role: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ['user', 'admin'],
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});
const User = mongoose.model('User', userSchema);

module.exports = User;
