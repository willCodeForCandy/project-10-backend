const { checkForDuplicates } = require('../../utils/checkForDuplicates');
const { deleteFromCloudinary } = require('../../utils/deleteFromCloudinary');
const { generateSign } = require('../../utils/jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
    //Todos los usuarios seran USER por default
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
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //comparo la clave ingresada con la almacenada en la BBDD
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //genero el token
        const token = generateSign(user._id);
        return res.status(200).json({ user, token });
      } else {
        return res.status(400).json('Usuario o contraseña incorrectos');
      }
    } else {
      return res.status(400).json('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().select('-password').populate('favGames');
    return res.status(200).json(allUsers);
  } catch (error) {
    return next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id || req.user.role === 'admin') {
      const { email, profilePic, favGames } = req.body;
      //Tomo solamente los datos que quiero que se puedan cambiar con esta ruta. Así, evito que se modifiquen el nombre de usuario, la contraseña, o el rol del usuario.
      const newUser = new User({ email, profilePic, favGames });
      const existingUser = await User.findById(id);
      newUser._id = id;
      //favGames es un array, por lo que hay que combinar el contenido previo con el nuevo antes de actualizar
      newUser.favGames = checkForDuplicates(
        existingUser.favGames,
        newUser.favGames
      );
      //La imagen de perfil se puede actualizar con una string o un archivo. Si es un archivo, se sube a cloudinary. En ambos casos, quiero eliminar la imagen previa si estaba almacenada en cloudinary.
      if (req.file) {
        newUser.profilePic = req.file.path;
        deleteFromCloudinary(existingUser.profilePic);
      }
      if (req.body.profilePic) {
        deleteFromCloudinary(existingUser.profilePic);
      }
      const updatedUser = await User.findByIdAndUpdate(id, newUser, {
        new: true
      });
      return res
        .status(200)
        .json({ message: 'Usuario actualizado correctamente', updatedUser });
    }
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id || req.user.role === 'admin') {
      const deletedUser = await User.findByIdAndDelete(id);
      deleteFromCloudinary(deletedUser.profilePic);
      return res.status(200).json(deletedUser);
    } else {
      return res
        .status(401)
        .json('No estás autorizado para realizar esta acción.');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, getUsers, editUser, deleteUser };
