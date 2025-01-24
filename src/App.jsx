import React from 'react';
import MembersList from './components/MembersList';
import Home from './pages/Home';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { setUser, clearUser } from './store'; // Import Redux actions
import { useEffect } from 'react';

const App = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Fetch the current user session on initial load
    const fetchUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(setUser(user));
      }
    };

    fetchUserSession();

    // Listen to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    // Cleanup the subscription
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <Home/>
    </div>
  );
};

export default App;
