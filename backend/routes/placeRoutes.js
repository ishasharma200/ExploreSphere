const express = require('express');
const router = express.Router();
const { getPlaces, createPlace, getPlaceById, updatePlace, deletePlace } = require('../controllers/placeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', authMiddleware, createPlace);
router.put('/:id', authMiddleware, updatePlace);
router.delete('/:id', authMiddleware, deletePlace);

module.exports = router;