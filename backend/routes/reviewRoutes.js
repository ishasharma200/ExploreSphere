const express = require('express');
const router = express.Router();
const { getReviews, addReview, getAverageRating } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:placeId', getReviews);
router.get('/:placeId/rating', getAverageRating);
router.post('/', authMiddleware, addReview);

module.exports = router;
