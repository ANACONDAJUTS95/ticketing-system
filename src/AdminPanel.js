import React from "react";
import "./AdminPanel.css";

const AdminPanel = ({ queue, setQueue }) => {
  // Count tickets by department
  const ticketStats = {
    total: queue.length,
    ultrasound: queue.filter((t) => t.code.startsWith("US")).length,
    billing: queue.filter((t) => t.code.startsWith("B")).length,
    laboratory: queue.filter((t) => t.code.startsWith("LAB")).length,
  };

  // Function to remove a specific ticket
  const handleRemoveTicket = (indexToRemove) => {
    setQueue((prevQueue) => {
      const newQueue = prevQueue.filter((_, index) => index !== indexToRemove);

      // Update styling for the new first ticket
      if (newQueue.length > 0) {
        newQueue[0] = { ...newQueue[0], isFirst: true };
      }

      return newQueue;
    });
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="stats">
        <p><strong>Total Tickets:</strong> {ticketStats.total}</p>
        <p><strong>Ultrasound:</strong> {ticketStats.ultrasound}</p>
        <p><strong>Billing:</strong> {ticketStats.billing}</p>
        <p><strong>Laboratory:</strong> {ticketStats.laboratory}</p>
      </div>

      <h3>Active Tickets</h3>
      
      {/* Scrollable Ticket List */}
      <div className="scrollable-admin-tickets">
        <ul className="admin-ticket-list">
          {queue.map((ticket, index) => (
            <li 
              key={index} 
              className={`admin-ticket-item ${index === 0 ? "first-in-queue" : ""}`}
            >
              <span className="ticket-code">{ticket.code}</span>
              <button className="remove-btn" onClick={() => handleRemoveTicket(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
