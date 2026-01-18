import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2 className="footer-title">Secret<span>Bet.Admin</span></h2>
          <p className="footer-tagline">Control center for users, bets, and transactions.</p>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Overview</h3>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/bets">Bets</Link></li>
              <li><Link to="/deposit">Deposits</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Management</h3>
            <ul>
              <li><Link to="/withdraw">Withdrawals</Link></li>
              <li><Link to="/profile">Users</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Links</h3>
            <div className="footer-social">
              <a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Docs</a>
              <a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Status</a>
              <a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Support</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BetAdmin. Internal use only.</p>
      </div>
    </footer>
  );
};

export default Footer;
