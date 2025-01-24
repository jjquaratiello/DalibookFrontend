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
    <div className="w-96 h-[calc(100vh-5rem)] bg-white fixed top-20 left-0 overflow-y-auto custom-scrollbar">
      <ul className="divide-y divide-gray-300">
        <div className="p-2 pl-6 bg-white font-bold text-xl">Members</div>
        {members.map((member) => (
          <li
            key={member._id} // Assuming each member has a unique `_id` field
            className="flex items-center p-4 hover:bg-blue-50 cursor-pointer transition"
            onClick={() => onSelectMember(member)}
          >
            {/* Conditionally Render Profile Picture */}
            {member.picture && (
              <img
                src={member.picture}
                alt={member.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            {/* Member Details */}
            <div>
              <div className="text-gray-800 font-semibold">
                {member.name} <span className="text-gray-500">({member.year})</span>
              </div>
              <div className="text-sm text-gray-500">{member.major}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
