const { deleteFromCloudinary } = require('../../utils/deleteFromCloudinary');
const Boardgame = require('../models/boardgames');

const postBoardgame = async (req, res, next) => {
  try {
    const existingBoardgame = await Boardgame.findOne({
      title: req.body.title
    });
    if (existingBoardgame) {
      return res
        .status(400)
        .json(`${existingBoardgame.title} ya está en la base de datos.`);
    }
    // Si no encuentra otro juego con el mismo nombre, entonces creo el dato nuevo y proceso las imágenes
    console.log(req.body);
    const newBoardgame = new Boardgame(req.body);
    if (req.files) {
      req.files.forEach((file) => {
        newBoardgame.img.push(file.path);
      });
    }
    const savedBoardgame = await newBoardgame.save();
    return res.status(201).json(savedBoardgame);
  } catch (error) {
    next(error);
  }
};
const getBoardgames = async (req, res, next) => {
  try {
    const allBoardgames = await Boardgame.find();
    res.status(200).json(allBoardgames);
  } catch (error) {
    next(error);
  }
};
const getBoardgameByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const requestedBoardgame = await Boardgame.findOne({ title });
    requestedBoardgame
      ? res.status(200).json(requestedBoardgame)
      : res.status(404).json('Game not found 🦕');
  } catch (error) {
    next(error);
  }
};
const getBoardgameByPlayers = async (req, res, next) => {
  try {
    const { players } = req.params;
    const requestedBoardgames = await Boardgame.find({
      maxPlayers: { $gte: Number(players) },
      minPlayers: { $lte: Number(players) }
    });
    requestedBoardgames.length
      ? res.status(200).json(requestedBoardgames)
      : res
          .status(404)
          .json('No hay juegos que coincidan con tu criterio de búsqueda');
  } catch (error) {
    next(error);
  }
};
const editBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingBoardgame = await Boardgame.findById(id);
    const newBoardgame = new Boardgame(req.body);
    newBoardgame._id = id;
    if (req.files) {
      for (let img of req.files) {
        newBoardgame.img.push(img.path);
      }
    }
    newBoardgame.img = [...existingBoardgame.img, ...newBoardgame.img];
    const updatedBoardgame = await Boardgame.findByIdAndUpdate(
      id,
      newBoardgame,
      { new: true }
    );
    return res.status(200).json({
      message: 'Juego actualizado correctamente',
      game: updatedBoardgame
    });
  } catch (error) {
    next(error);
  }
};
const deleteBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedGame = await Boardgame.findByIdAndDelete(id);

    deletedGame.img.forEach((url) => {
      deleteFromCloudinary(url);
    });

    return res.status(200).json({ message: 'Juego eliminado', deletedGame });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  postBoardgame,
  getBoardgames,
  getBoardgameByTitle,
  getBoardgameByPlayers,
  editBoardgame,
  deleteBoardgame
};
