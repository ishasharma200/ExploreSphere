import { useParams, Link } from "react-router-dom";
import { useState } from "react";

const placesData = [
  {
    id: 1,
    name: "Shimla Mall Road",
    category: "tourist",
    image: "https://source.unsplash.com/1200x600/?shimla,mountain",
    rating: 4.5,
    desc: "Shimla Mall Road is a popular tourist attraction known for its colonial charm and scenic views.",
  },
  {
    id: 2,
    name: "Cafe Simla Times",
    category: "restaurant",
    image: "https://source.unsplash.com/1200x600/?cafe,food",
    rating: 4.2,
    desc: "A cozy cafe in Shimla offering delicious food and great ambience.",
  },
  {
    id: 3,
    name: "The Oberoi Cecil",
    category: "hotel",
    image: "https://source.unsplash.com/1200x600/?hotel,luxury",
    rating: 4.8,
    desc: "Luxury heritage hotel offering premium stay experience in Shimla.",
  },
];

export default function Details() {
  const { id } = useParams();
  const place = placesData.find((p) => p.id === Number(id));

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  if (!place) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Place not found 😔
      </div>
    );
  }

  // ➕ Add review
  const addReview = () => {
    if (comment.trim() === "") return;

    const newReview = {
      id: Date.now(),
      comment,
      rating,
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* BACK */}
      <div className="p-4">
        <Link to="/">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">
            ⬅ Back
          </button>
        </Link>
      </div>

      {/* IMAGE */}
      <div className="px-4">
        <img
          src={place.image}
          className="w-full h-[350px] object-cover rounded-2xl shadow"
        />
      </div>

      {/* INFO */}
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{place.name}</h1>

        <div className="flex gap-3 mt-3">
          <span className="bg-slate-200 px-3 py-1 rounded-full text-sm capitalize">
            {place.category}
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            ⭐ {place.rating}
          </span>
        </div>

        <p className="mt-5 text-gray-600">{place.desc}</p>

        {/* 🧾 ADD REVIEW BOX */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Add Review 💬</h2>

          {/* Rating */}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-3 border p-2 rounded w-full"
          >
            <option value="5">⭐ 5</option>
            <option value="4">⭐ 4</option>
            <option value="3">⭐ 3</option>
            <option value="2">⭐ 2</option>
            <option value="1">⭐ 1</option>
          </select>

          {/* Comment */}
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-3 w-full border p-2 rounded"
          />

          {/* Button */}
          <button
            onClick={addReview}
            className="mt-3 bg-slate-900 text-white px-4 py-2 rounded w-full"
          >
            Submit Review
          </button>
        </div>

        {/* 📜 REVIEWS LIST */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Reviews ⭐</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 mt-2">No reviews yet 😔</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-3 mt-3 rounded shadow"
              >
                <p>⭐ {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}