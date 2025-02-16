import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { ticketService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import "./TicketPage.css";

function TicketPage() {
  let { ticketCode } = useParams();
  const [ticket, setTicket] = useState(null);
  const [position, setPosition] = useState("-");
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [wasInQueue, setWasInQueue] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this URL with your actual Google Form URL
  const SURVEY_URL = "https://forms.gle/MCKYMVCwJTqmGBHH9";

  const checkTicketStatus = useCallback(async () => {
    try {
      setLoading(true);
      const ticketData = await ticketService.getTicketStatus(ticketCode);
      setTicket(ticketData);

      // Update position based on ticket status
      if (ticketData.status === 'completed') {
        setPosition("-");
        if (wasInQueue) {
          setShowSurveyModal(true);
        }
      } else if (ticketData.status === 'waiting') {
        setWasInQueue(true);
        // Set position based on ticket data
        setPosition(ticketData.position || "-");
      }

      // Trigger vibration if user is next in line
      if (ticketData.position === 1 && "vibrate" in navigator) {
        navigator.vibrate([500, 200, 500]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch ticket status');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketCode, wasInQueue]);

  useEffect(() => {
    checkTicketStatus();
    const interval = setInterval(checkTicketStatus, 5000);
    return () => clearInterval(interval);
  }, [checkTicketStatus]);

  const handleTakeSurvey = () => {
    window.open(SURVEY_URL, '_blank');
    setShowSurveyModal(false);
  };

  const handleSkip = () => {
    const confirmClose = window.confirm('Are you sure you want to leave this page?');
    if (confirmClose) {
      // This will effectively "close" the page by redirecting to about:blank
      window.location.href = "about:blank";
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Ticket Information..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={checkTicketStatus} />;
  }

  return (
    <div className="ticket-container">
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>
      <h1>Your Ticket</h1>
      <div className="ticket-box">
        <h2 className="ticket-code">{ticketCode}</h2>
        <div className="ticket-status">
          <p className="ticket-position">
            Position in Line: <strong>{position}</strong>
          </p>
          <p className="ticket-state">
            Status: <strong>{ticket?.status || 'Unknown'}</strong>
          </p>
          {ticket?.status === 'completed' && (
            <p className="ticket-completed">
              Your turn has been completed
            </p>
          )}
        </div>
        <QRCodeCanvas 
          value={`https://your-netlify-app-name.netlify.app/ticket/${ticketCode}`} 
          size={150} 
        />
      </div>
      <p className="ticket-note">
        Please keep this page open. Your phone will vibrate when you're next in line.
      </p>

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="modal">
          <div className="modal-content survey-modal">
            <h2>Thank You for Visiting!</h2>
            <p>Would you mind taking a quick satisfaction survey? Your feedback helps us improve our services.</p>
            <div className="survey-buttons">
              <button onClick={handleTakeSurvey} className="survey-btn">
                Take Survey
              </button>
              <button onClick={handleSkip} className="skip-btn">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketPage; 