import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient'; // Import the Supabase client
import { FaUserCircle } from 'react-icons/fa';
import { setUser, clearUser } from '../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Get user state from Redux
  const [showModal, setShowModal] = useState(false); // Modal state
  const [memberData, setMemberData] = useState({
    name: '',
    year: '',
    major: '',
    minor: '',
    birthday: '',
    home: '',
    quote: '',
    picture: '',
    dartmouthTradition: '',
    favoriteThing1: '',
    favoriteThing2: '',
    favoriteThing3: '',
    funFact: '',
  }); 

  console.log('Current user from Redux:', user); // Debugging: Log the current user from Redux

  // Fetch user session on mount and populate Redux
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

  // Check if user is already in the database
  const checkFirstLogin = async (email) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/members/${email}`
      );
      console.log("Inside checkFirstLogin", response.data);
      if (!response.data.exists) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking first login:", error.response?.data || error.message);
    }
  };
  
  // Handle login
  const handleLogin = async () => {
    const { data: session, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in:', error);
    } else {
      const user = session?.user;
      dispatch(setUser(user)); // Update Redux with signed-in user
      console.log('User after sign-in:', user);
      checkFirstLogin(user.email); // Check if it's the first login
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
    } else {
      console.log('User signed out'); // Debugging: Log the sign-out action
      dispatch(clearUser()); // Clear Redux state
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/members`, {
        ...memberData,
        email: user.email, // Add the user's email
      });
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <nav className="px-6 py-4 flex items-center fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      {/* Logo */}
      <div className="flex-grow items-center space-x-4">
        <h1 className="text-2xl font-bold text-green-600">DaliBook</h1>
      </div>

      {/* Sign Up/Login or User Button */}
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md  text-white font-semibold transition hover:scale-105 bg-gradient-to-r from-green-500 via-green-600 to-green-700"
            >
              <FaUserCircle size={20} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white font-semibold transition hover:scale-105 bg-gradient-to-r from-green-500 via-green-600 to-green-700"
          >
            <FaUserCircle size={20} />
            <span>Sign Up / Login</span>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={memberData.name}
                onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {/* Add more fields for the other member data */}
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
