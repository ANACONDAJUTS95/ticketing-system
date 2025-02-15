import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UltrasoundQueue from "./pages/UltrasoundQueue";
import BillingQueue from "./pages/BillingQueue";
import LaboratoryQueue from "./pages/LaboratoryQueue";
import AdminPanel from "./pages/AdminPanel";
import TicketPage from "./pages/TicketPage";
import HomePage from "./pages/HomePage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/ultrasound" element={<UltrasoundQueue />} />
      <Route path="/billing" element={<BillingQueue />} />
      <Route path="/laboratory" element={<LaboratoryQueue />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/ticket/:ticketCode" element={<TicketPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
);
