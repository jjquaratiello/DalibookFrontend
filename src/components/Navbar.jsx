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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          dispatch(setUser(user));
          await checkFirstLogin(user.email);
        }
      } catch (error) {
        console.error('Error fetching user session:', error.message);
      }
    };

    fetchUserSession();
  }, [dispatch]);

  // Check if the user is logging in for the first time
  const checkFirstLogin = async (email) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/${email}`);
      if (!response.data.exists) {
        setShowModal(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowModal(true); // Show modal if user not found
      } else {
        console.error('Error checking first login:', error.response?.data || error.message);
      }
    }
  };

  // Handle Google login
  const handleLogin = async () => {
    try {
      const { data: session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      if (session?.user) {
        dispatch(setUser(session.user));
        await checkFirstLogin(session.user.email);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch(clearUser());
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  // Handle saving member details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/members`, {
        ...memberData,
        email: user.email, 
      });
      setShowModal(false); 
    } catch (error) {
      console.error('Error adding member:', error.response?.data || error.message);
    }
  };

  return (
    <nav className="px-6 py-4 flex items-center fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      {/* Logo */}
      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-green-600">DaliBook</h1>
      </div>

      <div className="flex space-x-6">
        <Link to="/" className="hover:font-bold duration-300">
          Home
        </Link>
        <Link to="/showcase" className="hover:font-bold duration-300">
          Showcase
        </Link>
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
