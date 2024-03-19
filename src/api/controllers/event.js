const { checkForDuplicates } = require('../../utils/checkForDuplicates');
const Event = require('../models/event');

const postEvent = async (req, res, next) => {
  try {
    //En este caso, no me interesa comprobar si existe otro evento con el mismo nombre. En cualquier caso, se puede controlar en el front y advertir al usuario, pero no quiero evitar que se puedan crear 2 eventos iguales
    const newEvent = new Event(req.body);
    //La persona que crea el evento queda registrada como organizador.
    newEvent.organizer = req.user._id;
    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    next(error);
  }
};
const getEvents = async (req, res, next) => {
  try {
    const allEvents = await Event.find()
      .populate('assistants', 'username profilePic favGames')
      .populate('game');
    return res.status(200).json(allEvents);
  } catch (error) {
    next(error);
  }
};
const updateEvent = async (req, res, next) => {
  try {
    const isOrganizer = req.user.isOrganizer;
    const { id } = req.params;
    const newEvent = new Event(req.body);
    //busco la versión previa para poder unificar los datos que son array (los asistentes)
    const previousEvent = await Event.findById(id);
    if (!previousEvent) {
      return res.status(404).json('Evento no encontrado 💔');
      //? Sería muy raro que un usuario intente editar un evento que no existe, pero desde producción a mí me pasó muchas veces. ¿Tiene sentido dejar este if o sería mejor borrarlo? Si el id es incorrecto, igualmente salta un error más adelante, pero es más inespecífico y además asumo que será mejor (más eficiente) controlar el error antes.
    }
    newEvent._id = id;
    newEvent.assistants = checkForDuplicates(
      previousEvent.assistants,
      newEvent.assistants
    );
    if (!isOrganizer) {
      newEvent.organizer = previousEvent.organizer;
      //Solo el oganizador del evento puede asignar un nuevo organizador
    }
    const updatedEvent = await Event.findByIdAndUpdate(id, newEvent, {
      new: true
    })
      .populate('game', 'title')
      .populate('assistants', 'username')
      .populate('organizer', 'username');
    return res.status(200).json({
      message: 'Evento actualizado correctamente',
      updatedEvent
    });
  } catch (error) {
    next(error);
  }
};
const deleteEvent = async (req, res, next) => {
  try {
    if (req.user.isAdmin || req.user.isOrganizer) {
      const { id } = req.params;
      const deletedEvent = await Event.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: 'Evento eliminado', deletedEvent });
    } else {
      return res
        .status(401)
        .json('Necesitas autorización para realizar esta acción.');
    }
  } catch (error) {}
};

module.exports = { postEvent, getEvents, updateEvent, deleteEvent };
