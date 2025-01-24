import { useState, useEffect } from "react";
import axios from "axios";
import "../Sidebar.css"; // Import custom styles for the scrollbar

const Sidebar = ({ onSelectMember }) => {
  const [members, setMembers] = useState([]);

  // Fetch members from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div
      className="w-96 h-[calc(100vh-5rem)] bg-white fixed top-20 left-0 border-r border-gray-200 overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="p-2 pl-6 bg-white font-bold text-xl sticky top-0 z-10 shadow-md">
        Members
      </div>

      {/* Members List */}
      <ul className="divide-y divide-gray-300">
        {members.map((member) => (
          <li
            key={member._id}
            className="flex items-center p-4 hover:bg-blue-50 cursor-pointer transition"
            onClick={() => onSelectMember(member)}
          >
            {/* Profile Picture */}
            {member.picture && (
              <img
                src={member.picture}
                alt={member.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            {/* Member Details */}
            <div className="overflow-hidden">
              <div className="text-gray-800 font-semibold truncate">
                {member.name}{" "}
                <span className="text-gray-500">({member.year})</span>
              </div>
              <div className="text-sm text-gray-500 truncate">{member.major}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
