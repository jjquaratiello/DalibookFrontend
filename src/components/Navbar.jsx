const Navbar = () => {
  return (
    <nav className="px-6 py-4 flex items-center fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-blue-600">DaliBook</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-grow ml-8">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-6">
        <a href="#" className="text-gray-600 hover:text-blue-600">
          Home
        </a>
        <a href="#" className="text-gray-600 hover:text-blue-600">
          About
        </a>
        <a href="#" className="text-gray-600 hover:text-blue-600">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
