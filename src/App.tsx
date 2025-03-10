import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("userEmail");
  });

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup setUserEmail={setUserEmail} />} />
        <Route 
          path="/dashboard" 
          element={userEmail ? <Dashboard userEmail={userEmail} setUserEmail={setUserEmail} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
