const Review = require('../models/Review');
const Place = require('../models/Place');
const { validateReviewPayload, isValidObjectId } = require('../utils/validation');

// GET REVIEWS FOR A PLACE
const getReviews = async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!isValidObjectId(placeId)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

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

    const validation = validateReviewPayload({ placeId, rating, comment }, { partial: false });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const review = await Review.create({
      user: userId,
      place: placeId,
      rating: Number(rating),
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
    if (!isValidObjectId(placeId)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

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

// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const validation = validateReviewPayload({ rating, comment }, { partial: true });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;
    await review.save();
    const populated = await review.populate('user', 'name');
    req.app.get('io').emit('review:updated', populated);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: id });
    req.app.get('io').emit('review:deleted', { id });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, addReview, getAverageRating, updateReview, deleteReview };
