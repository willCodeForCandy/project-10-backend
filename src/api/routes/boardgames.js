const { isLoggedIn, isAdmin } = require('../../middlewares/auth');
const { uploadBoardgames } = require('../../middlewares/uploadFiles');
const {
  postBoardgame,
  getBoardgames,
  getBoardgameByTitle,
  getBoardgameByPlayers,
  editBoardgame,
  deleteBoardgame
} = require('../controllers/boardgames');

const boardgameRouter = require('express').Router();

boardgameRouter.post(
  '/',
  isLoggedIn,
  isAdmin,
  uploadBoardgames.array('img'),
  postBoardgame
);
boardgameRouter.get('/', getBoardgames);
boardgameRouter.get('/title/:title', getBoardgameByTitle);
boardgameRouter.get('/players/:players', getBoardgameByPlayers);
boardgameRouter.put(
  '/:id',
  isLoggedIn,
  uploadBoardgames.array('img'),
  editBoardgame
);
boardgameRouter.delete('/:id', isLoggedIn, isAdmin, deleteBoardgame);

module.exports = boardgameRouter;
