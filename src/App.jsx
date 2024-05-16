import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import About from "./About";
import Protected from "./Protected";
import Register from './Register';
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "./AuthContext";
import "./App.css";

const App = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AuthProvider onNavigate={handleNavigate}>
      <div className="App">
        <header className="App-header">
          <h1>Content Security Policy</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link> 
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <Protected />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
