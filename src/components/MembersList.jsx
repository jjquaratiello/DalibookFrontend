import React, { useEffect, useState } from 'react';
import API from '../api';
import MemberCard from './MemberCard';

const MembersList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    API.get('/members')
      .then((response) => {
        setMembers(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
      });
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map((member) => (
        <MemberCard key={member._id} member={member} />
      ))}
    </div>
  );
};

export default MembersList;
