const { isLoggedIn, isAdmin } = require('../../middlewares/auth');
const { uploadUsers } = require('../../middlewares/uploadFiles');
const {
  register,
  login,
  getUsers,
  editUser,
  deleteUser
} = require('../controllers/user');

const userRouter = require('express').Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/', isLoggedIn, isAdmin, getUsers);
userRouter.put('/:id', isLoggedIn, uploadUsers.single('profilePic'), editUser);
userRouter.delete('/:id', isLoggedIn, deleteUser);

module.exports = userRouter;
