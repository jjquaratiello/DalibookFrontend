import React from "react";

const ProfileView = ({ member }) => {
  if (!member) return null;

  return (
    <div className="p-4">
      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-4 w-full">
        <div className="flex items-center space-x-4 mb-4">
          {/* Profile Picture */}
          {member.picture && (
            <img
              src={member.picture}
              alt={member.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          {/* Name and Basic Info */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
            <p className="text-gray-500">{member.major}</p>
            <p className="text-gray-400">{member.year}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Quote</h3>
          <p className="text-gray-600">{member.quote || "No bio provided."}</p>
        </div>

        {/* Additional Details */}
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-1">
            Favorite Things
          </h4>
          <p className="text-gray-600">
            {member.favoriteThing1}, {member.favoriteThing2},{" "}
            {member.favoriteThing3}
          </p>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-1">Fun Fact</h4>
          <p className="text-gray-600">{member.funFact || "Not available"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
