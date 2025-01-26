import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar'; // Example Navbar for navigation
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { setUser, clearUser } from './store'; // Import Redux actions
import Showcase from './pages/Showcase';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(setUser(user));
      }
    };

    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showcase" element={<Showcase/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
