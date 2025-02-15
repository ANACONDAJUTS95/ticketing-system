import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QueuePage.css";
import { Link } from 'react-router-dom';

const QueuePage = ({ department, prefix }) => {
  const [queue, setQueue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem(`${department}Queue`)) || [];
    setQueue(savedQueue);
  }, [department]);

  useEffect(() => {
    localStorage.setItem(`${department}Queue`, JSON.stringify(queue));
  }, [queue, department]);

  const generateTicket = () => {
    const dingSound = new Audio("/sounds/ding.mp3");
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const ticketCode = `${prefix}-${randomNumber}`;
    const newQueue = [...queue, { code: ticketCode, timestamp: Date.now() }];
    setQueue(newQueue);
    dingSound.play();

    setModalTicket(ticketCode);
    setShowModal(true);
    setTimer(30);

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
  };

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
            <QRCodeCanvas value={`http://localhost:3000/ticket/${modalTicket}`} size={300} />
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