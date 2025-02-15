import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [queues, setQueues] = useState({
    ultrasound: [],
    billing: [],
    laboratory: []
  });

  const dingSound = new Audio("/sounds/ding.mp3");

  const loadQueues = () => {
    const ultrasoundQueue = JSON.parse(localStorage.getItem("UltrasoundQueue")) || [];
    const billingQueue = JSON.parse(localStorage.getItem("BillingQueue")) || [];
    const laboratoryQueue = JSON.parse(localStorage.getItem("LaboratoryQueue")) || [];

    setQueues({
      ultrasound: ultrasoundQueue,
      billing: billingQueue,
      laboratory: laboratoryQueue
    });
  };

  useEffect(() => {
    loadQueues();
    // Refresh queues every 5 seconds
    const interval = setInterval(loadQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRemoveTicket = (department, index) => {
    try {
      // Get the current queue from localStorage
      const queueKey = `${department.charAt(0).toUpperCase() + department.slice(1)}Queue`;
      const currentQueue = JSON.parse(localStorage.getItem(queueKey)) || [];
      
      // Store the removed ticket info before removing
      const removedTicket = currentQueue[index];
      
      // Remove the ticket
      const updatedQueue = currentQueue.filter((_, i) => i !== index);
      
      // Update localStorage
      localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
      
      // Update state
      setQueues(prev => ({
        ...prev,
        [department]: updatedQueue
      }));

      // Play sound and show notification
      dingSound.play();

      // Show currently serving ticket after removal
      const nextTicket = updatedQueue[0]?.code || "None";
      const departmentName = department.charAt(0).toUpperCase() + department.slice(1);
      
      // Create and show notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.innerHTML = `
        <p><strong>${removedTicket.code}</strong> has been removed</p>
        <p>Currently serving in ${departmentName}: <strong>${nextTicket}</strong></p>
      `;
      
      document.body.appendChild(notification);

      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);

      // Force reload queues
      loadQueues();
    } catch (error) {
      console.error('Error removing ticket:', error);
    }
  };

  const renderDepartmentQueue = (department, tickets) => (
    <div className="department-queue">
      <h2>{department}</h2>
      <div className="queue-stats">
        <p>Total Tickets: {tickets.length}</p>
        <p>Currently Serving: {tickets[0]?.code || "None"}</p>
      </div>
      <div className="scrollable-admin-tickets">
        <ul className="admin-ticket-list">
          {tickets.map((ticket, index) => (
            <li key={index} className={`admin-ticket-item ${index === 0 ? "first-in-queue" : ""}`}>
              <span className="ticket-code">{ticket.code}</span>
              <button 
                className="remove-btn" 
                onClick={() => handleRemoveTicket(department.toLowerCase(), index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>
      <h1>Admin Panel</h1>
      <div className="all-queues">
        {renderDepartmentQueue("Ultrasound", queues.ultrasound)}
        {renderDepartmentQueue("Billing", queues.billing)}
        {renderDepartmentQueue("Laboratory", queues.laboratory)}
      </div>
    </div>
  );
};

export default AdminPanel; 