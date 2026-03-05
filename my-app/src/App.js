import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./components/Landing";
import ProblemList from "./components/ProblemList";
import ProblemPage from "./components/ProblemPage";
import History from "./components/History";
import User from "./components/User";
import Login from "./components/Login";
import Register from "./components/Register";
import ContestPage from "./components/ContestPage";
import CreateContest from "./components/CreateContest";
import AddProblemToContest from "./components/AddProblemToContest";
import ContestList from "./components/ContestList";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminAddProblem from "./components/admin/AdminAddProblem";
import AdminEditProblem from "./components/admin/AdminEditProblem";
import AdminProblemList from "./components/admin/AdminProblemList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-contest" element={<CreateContest />} />
        <Route path="/contest/:id" element={<ContestPage />} />
        <Route path="/admin/contest/:id/add-problem" element={<AddProblemToContest />} />
        <Route path="/contests" element={<ContestList />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-problem" element={<AdminAddProblem />} />
        <Route path="/admin/edit-problem/:id" element={<AdminEditProblem />} />
        <Route path="/admin/problems" element={<AdminProblemList />} />
      </Routes>
    </Router>
  );
}

export default App;
