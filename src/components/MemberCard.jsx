import React from 'react';

const MemberCard = ({ member }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img
        src={member.picture || 'https://via.placeholder.com/150'}
        alt={member.name}
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h2 className="text-xl font-semibold text-center mt-4">{member.name}</h2>
      <p className="text-gray-500 text-center">{member.major}</p>
      <p className="text-gray-400 text-center">{member.year}</p>
    </div>
  );
};

export default MemberCard;
