const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    date: { type: Date },
    location: { type: String, trim: true },
    assistants: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    game: { type: mongoose.Types.ObjectId, ref: 'Boardgame' },
    organizer: { type: mongoose.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    collection: 'events'
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
