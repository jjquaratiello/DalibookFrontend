import React from 'react';

const ProfileModal = ({ memberData, setMemberData, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        <form onSubmit={onSave} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            value={memberData.name}
            onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Graduation Year"
            value={memberData.year}
            onChange={(e) => setMemberData({ ...memberData, year: e.target.value })}
            className="w-full p-2 border rounded"
          />
    
          <div className="flex flex-wrap gap-2">
            {['dev', 'des', 'pm', 'core'].map((role) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={memberData[role]}
                  onChange={(e) => setMemberData({ ...memberData, [role]: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="capitalize">{role}</span>
              </label>
            ))}
          </div>
     
          <input
            type="text"
            placeholder="Major"
            value={memberData.major}
            onChange={(e) => setMemberData({ ...memberData, major: e.target.value })}
            className="w-full p-2 border rounded"
          />
         
          <input
            type="text"
            placeholder="Minor"
            value={memberData.minor}
            onChange={(e) => setMemberData({ ...memberData, minor: e.target.value })}
            className="w-full p-2 border rounded"
          />
         
          <input
            type="date"
            placeholder="Birthday"
            value={memberData.birthday}
            onChange={(e) => setMemberData({ ...memberData, birthday: e.target.value })}
            className="w-full p-2 border rounded"
          />
          
          <textarea
            placeholder="Favorite Quote"
            value={memberData.quote}
            onChange={(e) => setMemberData({ ...memberData, quote: e.target.value })}
            className="w-full p-2 border rounded resize-none"
            rows="2"
          />
         
          {['favoriteThing1', 'favoriteThing2', 'favoriteThing3'].map((key, index) => (
            <input
              key={key}
              type="text"
              placeholder={`Favorite Thing ${index + 1}`}
              value={memberData[key]}
              onChange={(e) => setMemberData({ ...memberData, [key]: e.target.value })}
              className="w-full p-2 border rounded"
            />
          ))}
 
          <textarea
            placeholder="Fun Fact"
            value={memberData.funFact}
            onChange={(e) => setMemberData({ ...memberData, funFact: e.target.value })}
            className="w-full p-2 border rounded resize-none"
            rows="2"
          />
        
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-400 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
