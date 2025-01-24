import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient'; // Import the Supabase client
import { FaUserCircle } from 'react-icons/fa';
import { setUser, clearUser } from '../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Get user state from Redux

  console.log('Current user from Redux:', user); // Debugging: Log the current user from Redux

  // Fetch user session on mount and populate Redux
  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        dispatch(setUser(user)); // Populate Redux with user data
      }
    };

    fetchUserSession();
  }, [dispatch]);

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
            className="flex items-center space-x-2 px-4 py-2 rounded-md border-2 border-green-400 text-white font-semibold transition hover:scale-105 bg-gradient-to-r from-green-500 via-green-400 to-green-300"
          >
            <FaUserCircle size={20} />
            <span>Sign Up / Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
