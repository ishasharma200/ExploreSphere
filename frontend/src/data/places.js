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

    const newPlace = {
      ...form,
      id: Date.now(),
      rating: 4,
    };

    // Get old data
    const oldPlaces = JSON.parse(localStorage.getItem("places")) || [];

    // Add new
    const updatedPlaces = [newPlace, ...oldPlaces];

    // Save
    localStorage.setItem("places", JSON.stringify(updatedPlaces));

    alert("Place Added 🚀");

    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="image" placeholder="Image URL" onChange={handleChange} className="border p-2 w-full mb-2" />
        <textarea name="desc" placeholder="Description" onChange={handleChange} className="border p-2 w-full mb-2" />
        <button className="bg-black text-white px-4 py-2 w-full">
          Add
        </button>
      </form>
    </div>
  );
}