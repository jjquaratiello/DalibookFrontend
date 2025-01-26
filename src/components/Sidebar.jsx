import { useState, useEffect } from "react";
import axios from "axios";
import "../Sidebar.css"; // Import custom styles for the scrollbar

const Sidebar = () => {
  const [members, setMembers] = useState([]);
  const [loadingImages, setLoadingImages] = useState({}); // State to track image loading status
  const [expandedMember, setExpandedMember] = useState(null); // State to track which member is expanded

  // Fetch members from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Handle image load
  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/avatar.jpg"; // Fallback to the default avatar
    e.target.classList.add("opacity-100"); // Ensure the fallback image is visible
  };

  // Toggle dropdown for member details
  const toggleMemberDetails = (id) => {
    setExpandedMember((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="w-96 h-[calc(100vh-5rem)] bg-white fixed top-20 left-0 border-r border-gray-200 overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="p-2 pl-6 bg-white font-bold text-xl sticky top-0 z-10 shadow-md">
        Featured Members
      </div>

      {/* Members List */}
      <ul className="divide-y divide-gray-300">
        {members.map((member) => (
          <li key={member._id} className="p-4">
            {/* Member Header */}
            <div
              className="flex items-center justify-between hover:bg-green-50 cursor-pointer transition p-2 rounded-md overflow-hidden"
              onClick={() => toggleMemberDetails(member._id)}
            >
              <div className="flex items-center overflow-hidden">
                {/* Profile Picture with Skeleton */}
                <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                  {loadingImages[member._id] !== false && (
                    <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={member.picture || "/avatar.jpg"}
                    alt={member.name}
                    className="w-12 h-12 rounded-full transition-opacity duration-500 opacity-0"
                    onLoad={(e) => {
                      e.target.style.opacity = 1;
                      handleImageLoad(member._id);
                    }}
                    onError={handleImageError} // Handle image loading errors
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-gray-800 font-semibold truncate">
                    {member.name} <span className="text-gray-500">({member.year})</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{member.major}</div>
                </div>
              </div>
              {/* Dropdown Icon */}
              <button
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent click
                  toggleMemberDetails(member._id);
                }}
              >
                {expandedMember === member._id ? "▲" : "▼"}
              </button>
            </div>

            {/* Member Details */}
            {expandedMember === member._id && (
              <div className="mt-2 p-2 bg-gray-100 rounded-md text-sm text-gray-700 overflow-hidden">
                <p><strong>Quote:</strong> {member.quote || "No quote provided."}</p>
                <p><strong>Favorite Things:</strong> {member.favoriteThing1}, {member.favoriteThing2}, {member.favoriteThing3}</p>
                <p><strong>Fun Fact:</strong> {member.funFact || "Not available"}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
