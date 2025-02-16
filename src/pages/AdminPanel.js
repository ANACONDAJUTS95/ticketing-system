import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import "./AdminPanel.css";

const AdminPanel = () => {
  const [queues, setQueues] = useState({
    ultrasound: [],
    billing: [],
    laboratory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadQueues = async () => {
    try {
      setLoading(true);
      const [ultrasoundQueue, billingQueue, laboratoryQueue] = await Promise.all([
        adminService.getDepartmentQueue('Ultrasound'),
        adminService.getDepartmentQueue('Billing'),
        adminService.getDepartmentQueue('Laboratory')
      ]);

      setQueues({
        ultrasound: ultrasoundQueue,
        billing: billingQueue,
        laboratory: laboratoryQueue
      });
      setError(null);
    } catch (err) {
      setError('Failed to load queues');
      console.error('Error loading queues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    loadQueues();
    const interval = setInterval(loadQueues, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleRemoveTicket = async (department, code) => {
    try {
      setLoading(true);
      await adminService.removeTicket(code);
      await loadQueues();
    } catch (err) {
      setError('Failed to remove ticket');
      console.error('Error removing ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    navigate('/');
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
                onClick={() => handleRemoveTicket(department.toLowerCase(), ticket.code)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading Admin Panel..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadQueues} />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Link to="/" className="back-home">← Back to Home</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
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