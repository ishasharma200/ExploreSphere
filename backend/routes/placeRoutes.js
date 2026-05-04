const express = require('express');
const router = express.Router();
const { getPlaces, createPlace, getPlaceById } = require('../controllers/placeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', authMiddleware, createPlace);

module.exports = router;