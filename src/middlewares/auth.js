const Event = require('../api/models/event');
const User = require('../api/models/user');
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
    return res
      .status(401)
      .json('No estás autorizado para realizar esta acción');
  }
};

const isAdmin = async (req, res, next) => {
  try {
    req.user.role === 'admin'
      ? (req.user.isAdmin = true)
      : (req.user.isAdmin = false);
    next();
  } catch (error) {
    return next(error);
  }
};

const isOrganizer = async (req, res, next) => {
  try {
    req.user.isOrganizer = false;
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('organizer');
    const organizerId = event.organizer.id;
    if (req.user.id === organizerId) {
      req.user.isOrganizer = true;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAdmin, isLoggedIn, isOrganizer };
