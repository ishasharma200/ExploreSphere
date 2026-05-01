import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function Details() {
  return <h1>Details Page</h1>;
}

function Login() {
  return <h1>Login Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}