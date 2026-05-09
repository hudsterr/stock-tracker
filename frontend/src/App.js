import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";

const CLIENT_ID = "1054854425510-0j8pm8dsth6nscljirjqg8ost6bo4p3t.apps.googleusercontent.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(true);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        {user && (
          <Navbar
            user={user}
            dark={dark}
            setDark={setDark}
            onLogout={() => setUser(null)}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={!user ? <SignIn setUser={setUser} dark={dark} /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={user ? <Home user={user} dark={dark} /> : <Navigate to="/" />}
          />
          <Route
            path="/portfolio"
            element={user ? <Portfolio dark={dark} /> : <Navigate to="/" />}
          />
          <Route
            path="/insights"
            element={user ? <Insights dark={dark} /> : <Navigate to="/" />}
          />
          <Route
            path="/contact"
            element={user ? <Contact dark={dark} /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}