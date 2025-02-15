import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./TicketPage.css";

function TicketPage() {
  let { ticketCode } = useParams();
  const [position, setPosition] = useState("-");

  useEffect(() => {
    // Check all department queues
    const ultrasoundQueue = JSON.parse(localStorage.getItem("UltrasoundQueue")) || [];
    const billingQueue = JSON.parse(localStorage.getItem("BillingQueue")) || [];
    const laboratoryQueue = JSON.parse(localStorage.getItem("LaboratoryQueue")) || [];

    // Find ticket in any queue
    let foundIndex = ultrasoundQueue.findIndex(ticket => ticket.code === ticketCode);
    if (foundIndex === -1) {
      foundIndex = billingQueue.findIndex(ticket => ticket.code === ticketCode);
    }
    if (foundIndex === -1) {
      foundIndex = laboratoryQueue.findIndex(ticket => ticket.code === ticketCode);
    }

    const newPosition = foundIndex !== -1 ? foundIndex + 1 : "-";
    setPosition(newPosition);

    // Trigger vibration if user is next in line
    if (newPosition === 1 && "vibrate" in navigator) {
      navigator.vibrate([500, 200, 500]); // Vibrate pattern
    }
  }, [ticketCode]);

  return (
    <div className="ticket-container">
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>
      <h1>Your Ticket</h1>
      <div className="ticket-box">
        <h2 className="ticket-code">{ticketCode}</h2>
        <p className="ticket-position">
          Position in Line: <strong>{position}</strong>
        </p>
        <QRCodeCanvas value={`http://localhost:3000/ticket/${ticketCode}`} size={150} />
      </div>
      <p className="ticket-note">
        Please keep this page open. Your phone will vibrate when you're next in line.
      </p>
    </div>
  );
}

export default TicketPage; 