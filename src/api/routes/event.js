const { isLoggedIn, isOrganizer, isAdmin } = require('../../middlewares/auth');
const {
  postEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/event');

const eventRouter = require('express').Router();

eventRouter.post('/', isLoggedIn, postEvent);
eventRouter.get('/', getEvents);
eventRouter.put('/:id', isLoggedIn, isOrganizer, isAdmin, updateEvent);
eventRouter.delete('/:id', isLoggedIn, isOrganizer, isAdmin, deleteEvent);

module.exports = eventRouter;
