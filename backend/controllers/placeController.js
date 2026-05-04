const Place = require('../models/Place');

// GET ALL PLACES
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// CREATE PLACE
const createPlace = async (req, res) => {
  try {
    const { name, location, category, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Place name is required' });
    }

    const place = await Place.create({
      name,
      location: location || '',
      category: category || '',
      description: description || '',
    });

    req.app.get('io').emit('place:created', place);
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PLACE BY ID
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlaces, createPlace, getPlaceById };