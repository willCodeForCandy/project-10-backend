const { uploadUsers } = require('../../middlewares/uploadFiles');
const { register, login } = require('../controllers/users');

const userRouter = require('express').Router();

userRouter.post('/register', uploadUsers.single('profilePic'), register);
userRouter.post('/login', login);

module.exports = userRouter;
