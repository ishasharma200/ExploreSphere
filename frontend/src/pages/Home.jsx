import { useState } from "react";
import { Link } from "react-router-dom";

const placesData = [
  {
    id: 1,
    name: "Shimla Mall Road",
    category: "tourist",
    image: "https://source.unsplash.com/800x600/?shimla,mountain",
    rating: 4.5,
    desc: "Popular shopping street with scenic mountain views.",
  },
  {
    id: 2,
    name: "Cafe Simla Times",
    category: "restaurant",
    image: "https://source.unsplash.com/800x600/?cafe,food",
    rating: 4.2,
    desc: "Cozy café with great food and ambience.",
  },
  {
    id: 3,
    name: "The Oberoi Cecil",
    category: "hotel",
    image: "https://source.unsplash.com/800x600/?hotel,luxury",
    rating: 4.8,
    desc: "Luxury heritage hotel in Shimla.",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPlaces = placesData.filter((place) => {
    return (
      place.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || place.category === filter)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔷 NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white shadow-md">
        <h1 className="text-2xl font-bold">Explore Sphere 🌍</h1>

        <div className="flex gap-6 text-sm">
          <Link className="hover:text-gray-300" to="/">Home</Link>
          <Link className="hover:text-gray-300" to="/login">Login</Link>
        </div>
      </nav>

      {/* 🔥 HERO SECTION */}
      <div className="text-center py-10 px-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <h2 className="text-3xl md:text-4xl font-bold">
          Discover Amazing Places
        </h2>
        <p className="mt-2 text-gray-300">
          Find hotels, restaurants & tourist spots near you
        </p>
      </div>

      {/* 🔍 SEARCH */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Search places..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[90%] md:w-1/2 px-4 py-3 rounded-xl border shadow focus:outline-none focus:ring-2 focus:ring-slate-800"
        />
      </div>

      {/* 📂 FILTERS */}
      <div className="flex justify-center mt-5 gap-3 flex-wrap">
        {["all", "hotel", "restaurant", "tourist"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${filter === type
                ? "bg-slate-900 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🧾 CARDS GRID */}
      <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300"
            >
              {/* IMAGE */}
              <img
                src={place.image}
                alt={place.name}
                className="h-44 w-full object-cover hover:scale-105 transition duration-300"
              />

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{place.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {place.desc}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-yellow-500 font-semibold">
                    ⭐ {place.rating}
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
                    {place.category}
                  </span>
                </div>

                <Link to={`/place/${place.id}`}>
                  <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No places found 😔
          </p>
        )}
      </div>
    </div>
  );
}