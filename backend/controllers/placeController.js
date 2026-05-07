const Place = require('../models/Place');
const Review = require('../models/Review');
const { validatePlacePayload, isValidObjectId } = require('../utils/validation');

// GET ALL PLACES
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find().populate('createdBy', 'name email');
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// CREATE PLACE
const createPlace = async (req, res) => {
  try {
    const validation = validatePlacePayload(req.body, { partial: false });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const { name, location, category, description, images } = req.body;

    const place = await Place.create({
      name: name.trim(),
      location: location ? location.trim() : '',
      category: category ? category.trim() : '',
      description: description ? description.trim() : '',
      images: images || [],
      createdBy: req.userId || null,
    });

    const populated = await place.populate('createdBy', 'name email');
    req.app.get('io').emit('place:created', populated);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PLACE
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    if (place.createdBy && place.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this place' });
    }

    const validation = validatePlacePayload(req.body, { partial: true });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const { name, location, category, description, images } = req.body;
    if (name !== undefined) place.name = name.trim();
    if (location !== undefined) place.location = location.trim();
    if (category !== undefined) place.category = category.trim();
    if (description !== undefined) place.description = description.trim();
    if (images !== undefined) place.images = images;

    await place.save();
    const populated = await place.populate('createdBy', 'name email');
    req.app.get('io').emit('place:updated', populated);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PLACE
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    if (place.createdBy && place.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this place' });
    }

    await Place.deleteOne({ _id: id });
    await Review.deleteMany({ place: id });
    req.app.get('io').emit('place:deleted', { id });
    res.json({ message: 'Place deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PLACE BY ID
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const place = await Place.findById(id).populate('createdBy', 'name email');
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlaces, createPlace, getPlaceById, updatePlace, deletePlace };