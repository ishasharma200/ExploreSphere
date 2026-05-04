const Review = require('../models/Review');
const Place = require('../models/Place');

// GET REVIEWS FOR A PLACE
const getReviews = async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ place: placeId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD REVIEW
const addReview = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      user: userId,
      place: placeId,
      rating,
      comment: comment || '',
    });

    const populatedReview = await review.populate('user', 'name');
    req.app.get('io').emit('review:created', populatedReview);
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AVERAGE RATING FOR A PLACE
const getAverageRating = async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ place: placeId });
    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }
    const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    res.json({ average, count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, addReview, getAverageRating };
