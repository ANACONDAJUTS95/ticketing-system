import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QueuePage.css";
import { Link } from 'react-router-dom';
import { queueService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const QueuePage = ({ department, prefix }) => {
  const [queue, setQueue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch and update queue
  const updateQueue = useCallback(async () => {
    try {
      setLoading(true);
      const tickets = await queueService.getDepartmentQueue(department);
      setQueue(tickets);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
    }
  }, [department]);

  // Initial load and interval setup for real-time updates
  useEffect(() => {
    // Initial load
    updateQueue();

    // Set up interval to check for updates every 2 seconds
    const interval = setInterval(updateQueue, 2000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [updateQueue]);

  // Save queue to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`${department}Queue`, JSON.stringify(queue));
  }, [queue, department]);

  const generateTicket = async () => {
    try {
      setLoading(true);
      const dingSound = new Audio("/sounds/ding.mp3");
      const newTicket = await queueService.generateTicket(department, prefix);
      
      setModalTicket(newTicket.code);
      setShowModal(true);
      setTimer(30);
      dingSound.play();

      await updateQueue();

      if (timerId) clearTimeout(timerId);
      
      const newTimerId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearTimeout(newTimerId);
            setShowModal(false);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);

      setTimerId(newTimerId);
    } catch (err) {
      setError('Failed to generate ticket');
      console.error('Error generating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Loading ${department} Queue...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={updateQueue} />;
  }

  return (
    <div className="queue-container">
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>
      <h1>{department} Queue</h1>

      <div className="now-serving">
        <h2>Now Serving: {queue.length > 0 ? queue[0].code : "No Tickets"}</h2>
      </div>

      <div className="queue-list">
        <h2>Current Queue</h2>
        <div className="scrollable-queue">
          <ul>
            {queue.map((ticket, index) => (
              <li key={index} className={index === 0 ? "first-in-queue" : ""}>
                <span className="ticket-code">{ticket.code}</span>
                <span className="ticket-position">Position: {index + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="get-ticket-btn" onClick={generateTicket}>
        Get {department} Ticket
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Ticket</h2>
            <QRCodeCanvas 
              value={`https://ers-queue-list.netlify.app/ticket/${modalTicket}`} 
              size={300} 
            />
            <p>{modalTicket}</p>
            <button onClick={() => setShowModal(false)}>
              Done Scanning ({timer}s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueuePage; 