import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socket from "./socket";

import RoleSelection from "./pages/RoleSelection";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher"; 
import KickedOutPage from "./pages/KickoutPage";
import PollHistoryPage from "./pages/PollHistory";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/kickout" element={<KickedOutPage />} />
        <Route path="/history" element={<PollHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
