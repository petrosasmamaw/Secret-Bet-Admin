import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from './Slices/authSlice';
import Dashboard from './pages/dashboard';
import Bets from './pages/bets';
import Login from './pages/login';
import Profile from './pages/profile';
import Register from './pages/register';
import Withdraw from './pages/withdraw';
import Deposit from './pages/deposit';
import Navbar from './pages/navbar';
import Footer from './pages/footer';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  return (
    <div className="app">
      <Navbar user={user} />
      <main className="main-content">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/bets" element={<Bets user={user} />} />
              <Route path="/deposit" element={<Deposit user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/withdraw" element={<Withdraw user={user} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login user={user} />} />
              <Route path="/login" element={<Login user={user} />} />
              <Route path="/register" element={<Register user={user} />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
