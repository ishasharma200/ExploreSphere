import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlaceDetails from './pages/PlaceDetails';
import AddPlace from './pages/AddPlace';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/add" element={<AddPlace />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<div className="page-shell"><div className="card" style={{ padding: '28px', textAlign: 'center' }}><p className="muted" style={{ marginTop: 0 }}>Page not found.</p><h1 className="section-title">This route does not exist.</h1><p className="section-copy">Try the home page, browse places, or explore how the app works.</p></div></div>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;