import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./TicketPage.css";

function TicketPage() {
  let { ticketCode } = useParams();
  const [position, setPosition] = useState("-");

  useEffect(() => {
    const storedQueue = JSON.parse(localStorage.getItem("queue")) || [];
    const index = storedQueue.findIndex(ticket => ticket.code === ticketCode);
    const newPosition = index !== -1 ? index + 1 : "-";

    setPosition(newPosition);

    // Trigger vibration if user is next in line
    if (newPosition === 1 && "vibrate" in navigator) {
      navigator.vibrate([500, 200, 500]); // Vibrate pattern
    }
  }, [ticketCode]);

  return (
    <div className="ticket-container">
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
};

export default TicketPage;
