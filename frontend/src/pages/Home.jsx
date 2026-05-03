import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const defaultPlaces = [
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
  const [places] = useState(() => {
    try {
      const stored = localStorage.getItem("places");
      return stored ? JSON.parse(stored) : defaultPlaces;
    } catch {
      return defaultPlaces;
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Persist places to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("places", JSON.stringify(places));
    } catch {
      // ignore localStorage errors
    }
  }, [places]);

  const filteredPlaces = places.filter((place) => {
    return (
      place.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || place.category === filter)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white shadow-md">
        <h1 className="text-2xl font-bold">Explore Sphere 🌍</h1>

        <div className="flex gap-6 text-sm items-center">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/add" className="bg-white text-slate-900 px-3 py-1 rounded">
            Add Place
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center py-10 bg-slate-800 text-white">
        <h2 className="text-3xl font-bold">Discover Amazing Places</h2>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center mt-6">
        <input
          className="w-1/2 p-3 border rounded"
          placeholder="Search places..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER */}
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        {["all", "hotel", "restaurant", "tourist"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className="px-4 py-1 bg-gray-200 rounded"
          >
            {type}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-white p-4 rounded shadow">
            <img src={place.image} className="h-40 w-full object-cover rounded" />
            <h3 className="font-bold mt-2">{place.name}</h3>
            <p className="text-sm text-gray-500">{place.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}