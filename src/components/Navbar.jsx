import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { FaUserCircle } from 'react-icons/fa';
import { setUser, clearUser } from '../store';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); 
  const [showModal, setShowModal] = useState(false); 
  const [memberData, setMemberData] = useState({
    name: '',
    year: '',
    major: '',
    minor: '',
    birthday: '',
    home: '',
    quote: '',
    dartmouthTradition: '',
    favoriteThing1: '',
    favoriteThing2: '',
    favoriteThing3: '',
    funFact: '',
  }); 

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(setUser(user)); 
        checkFirstLogin(user.email); 
      }
    };

    fetchUserSession();
  }, [dispatch]);

  const checkFirstLogin = async (email) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/${email}`);
      if (!response.data.exists) {
        setShowModal(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowModal(true);
      } else {
        console.error("Error checking first login:", error.response?.data || error.message);
      }
    }
  };

  const handleLogin = async () => {
    const { data: session, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in:', error);
    } else {
      const user = session?.user;
      dispatch(setUser(user)); 
      checkFirstLogin(user.email);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
    } else {
      dispatch(clearUser());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/members`, {
        ...memberData,
        email: user.email,
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <nav className="px-6 py-4 flex items-center fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      <div className="flex-grow items-center space-x-4">
        <h1 className="text-2xl font-bold text-green-600">DaliBook</h1>
      </div>

      <div className="flex items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-green-500 via-green-600 to-green-700"
            >
              <FaUserCircle size={20} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-green-500 via-green-600 to-green-700"
          >
            <FaUserCircle size={20} />
            <span>Sign Up / Login</span>
          </button>
        )}
      </div>

      {showModal && (
        <ProfileModal
          memberData={memberData}
          setMemberData={setMemberData}
          onSave={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
