import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileView from "../components/ProfileView";
import Feed from "../components/Feed"; // Import the Feed component


const Home = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="flex bg-white min-h-screen">
        <Sidebar onSelectMember={setSelectedMember} />
        <div className="flex-grow ml-96 mt-16">
          {selectedMember ? (
            <ProfileView member={selectedMember} />
          ) : (
            <Feed /> // Render the Feed component when no member is selected
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;