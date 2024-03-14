const User = require('../models/users');

const register = async (req, res, next) => {
  try {
    const duplicateName = await User.findOne({ username: req.body.username });
    if (duplicateName) {
      return res.status(400).json('Ese nombre de usuario ya existe');
    }
    const duplicateEmail = await User.findOne({ email: req.body.email });
    if (duplicateEmail) {
      return res.status(400).json('Ya hay alguien registrado con ese email');
    }
    const { username, password, email, profilePic, favGames } = req.body;
    const newUser = new User({
      username,
      password,
      profilePic,
      email,
      favGames
    });
    newUser.role = 'user';
    if (req.file) {
      newUser.profilePic = req.file.path;
    }
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
module.exports = { register, login };
