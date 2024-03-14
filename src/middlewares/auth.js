const User = require('../api/models/users');
const { verifyJwt } = require('../utils/jwt');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    // Uso optional chaining porque si no hay token no quiero que de un error inespecífico, sino un status 401
    if (!token) {
      return res
        .status(401)
        .json('No estás autorizado para realizar esta acción');
    }
    const { id } = verifyJwt(token);
    const user = await User.findById(id);
    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    req.user.role === 'admin'
      ? next()
      : res.status(401).json('Esta acción requiere permisos de administrador');
  } catch (error) {
    return next(error);
  }
};
