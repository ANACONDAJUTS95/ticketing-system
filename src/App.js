import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";
import AdminPanel from "./AdminPanel";

const App = () => {
  const [queue, setQueue] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTicket, setModalTicket] = useState(null);
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState(null); // Track the timer

  useEffect(() => {
    // Load queue from local storage on startup
    const savedQueue = JSON.parse(localStorage.getItem("queue")) || [];
    setQueue(savedQueue);
    if (savedQueue.length > 0) {
      setCurrentTicket(savedQueue[0].code);
    }
  }, []);

  useEffect(() => {
    // Save queue to local storage whenever it changes
    localStorage.setItem("queue", JSON.stringify(queue));
  }, [queue]);

  const generateTicket = (type) => {
    const dingSound = new Audio("/sounds/ding.mp3");
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const ticketCode = `${type}-${randomNumber}`;
    const newQueue = [...queue, { code: ticketCode }];
    setQueue(newQueue);
    if (!currentTicket) setCurrentTicket(ticketCode);
    dingSound.play();

    // Show modal with generated ticket
    setModalTicket(ticketCode);
    setShowModal(true);
    setTimer(30); // Reset timer

    // Clear any existing timer before starting a new one
    if (timerId) clearTimeout(timerId);
    
    // Start new timer
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

  const closeModal = () => {
    if (timerId) clearTimeout(timerId);
    setShowModal(false);
    setTimer(30); // Reset timer
  };

  return (
    <div className="container">
      <h1>Ticketing System</h1>

      <div className="priority-box">
        <h2>Now Serving: {queue.length > 0 ? queue[0].code : "No Tickets"}</h2>
      </div>

      <div className="queue-box">
        <h2>Queue</h2>
        
        {/* Scrollable Ticket List */}
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

      {/* Admin Panel */}
      <AdminPanel queue={queue} setQueue={setQueue} />

      <div className="button-group">
        <button onClick={() => generateTicket("US")}>Get Ticket for Ultrasound</button>
        <button onClick={() => generateTicket("B")}>Get Ticket for Billing</button>
        <button onClick={() => generateTicket("LAB")}>Get Ticket for Laboratory</button>
      </div>

      {/* QR Code Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Ticket</h2>
            <QRCodeCanvas value={`http://localhost:3000/ticket/${modalTicket}`} size={300} />
            <p>{modalTicket}</p>
            <button onClick={closeModal}>Done Scanning ({timer}s)</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;