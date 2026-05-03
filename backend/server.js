require("dotenv").config()


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const PRIMARY_MONGO_URI = process.env.MONGO_URI;
const FALLBACK_MONGO_URI = process.env.MONGO_URI_FALLBACK || "mongodb://127.0.0.1:27017/exploreSphere";


// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Explore Sphere Backend Running 🚀");
});

// sample API route
app.get("/api/places", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Shimla Mall Road",
      category: "tourist",
    },
  ]);
});

async function connectDatabase() {
  const connectionCandidates = [PRIMARY_MONGO_URI, FALLBACK_MONGO_URI].filter(Boolean);

  for (const uri of connectionCandidates) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("MongoDB Connected ✅");
      return;
    } catch (error) {
      console.log("DB Error:", error.message);
    }
  }

  console.error("MongoDB connection failed. Set MONGO_URI to a reachable Atlas URI or start a local MongoDB instance at mongodb://127.0.0.1:27017/exploreSphere.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDatabase();