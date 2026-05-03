import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPlace() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "tourist",
    image: "",
    desc: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just console (backend later)
    console.log("New Place:", form);

    alert("Place Added Successfully 🚀");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add New Place ➕
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Place Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="tourist">Tourist</option>
          <option value="restaurant">Restaurant</option>
          <option value="hotel">Hotel</option>
        </select>

        {/* Image */}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Description */}
        <textarea
          name="desc"
          placeholder="Description"
          value={form.desc}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-700"
        >
          Add Place
        </button>
      </form>

    </div>
  );
}