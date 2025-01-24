const Hero = () => {
  return (
    <div className="text-white py-20 px-6 text-center h-screen flex flex-col justify-center items-center">
      {/* Gradient Text */}
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">
        Welcome to the DaliBook
      </h1>
      
      <p className="text-gray-700 text-lg mb-6">
        Discover the Dalilab
      </p>
      
      <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
        Get Started
      </button>
    </div>
  );
};

export default Hero;
