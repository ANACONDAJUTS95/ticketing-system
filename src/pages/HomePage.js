import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Admin credentials - you can customize these
  const ADMIN_EMAIL = 'ersmaternity@gmail.com';
  const ADMIN_PASSWORD = 'December2012';

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setShowSignInModal(false);
      setEmail('');
      setPassword('');
      navigate('/admin');
    } else {
      setShowErrorModal(true);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to ERS Maternity and Pediatric Care Clinic</h1>
      <div className="department-links">
        <Link to="/ultrasound" className="department-button">
          Ultrasound Department
        </Link>
        <Link to="/billing" className="department-button">
          Billing Department
        </Link>
        <Link to="/laboratory" className="department-button">
          Laboratory Department
        </Link>
        <button 
          className="admin-signin-button"
          onClick={() => setShowSignInModal(true)}
        >
          Admin Sign In
        </button>
      </div>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="modal">
          <div className="modal-content sign-in-modal">
            <h2>Admin Sign In</h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="sign-in-btn">Sign In</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowSignInModal(false);
                    setEmail('');
                    setPassword('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal">
          <div className="modal-content error-modal">
            <h2>Authentication Error</h2>
            <p>Invalid credentials. Please contact IT Support.</p>
            <button 
              className="error-btn"
              onClick={() => setShowErrorModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 