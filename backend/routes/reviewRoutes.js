const express = require('express');
const router = express.Router();
const { getReviews, addReview, getAverageRating, updateReview, deleteReview } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:placeId', getReviews);
router.get('/:placeId/rating', getAverageRating);
router.post('/', authMiddleware, addReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
