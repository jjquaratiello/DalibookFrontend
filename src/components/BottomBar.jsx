import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Sidebar.css'; 

const BottomBar = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState('Coding Tutorials');

  const fetchVideosByQuery = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/youtube/videos/${query}`); // Call to your backend endpoint
      setVideos(response.data || []);
    } catch (error) {
      console.error(`Error fetching videos for query "${query}":`, error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosByQuery(activeQuery);
  }, [activeQuery]);

  return (
    <div
      className="h-96 bg-white w-[calc(100vw-400px)] fixed bottom-0 left-96 py-4 border-t border-gray-200"
    >
      {/* Fixed Buttons */}
      <div className="flex items-center mb-4 sticky top-0 bg-white z-10 p-2 overflow-x-auto no-scrollbar space-x-4">
        {[
          'Coding Tutorials',
          'JavaScript Coding Tutorials',
          'Python Coding Tutorials',
          'React Coding Tutorials',
          'C Coding Tutorials',
          'XCode Coding Tutorials',
          'VR/AR Coding Tutorials',
        ].map((query) => (
          <button
            key={query}
            className={`whitespace-nowrap px-4 py-2 ${
              activeQuery === query
                ? 'text-white transition bg-gradient-to-r from-green-500 via-green-600 to-green-700'
                : 'bg-gray-200 text-gray-700 hover:scale-105 duration-300'
            } rounded-lg font-bold`}
            onClick={() => setActiveQuery(query)}
          >
            {query}
          </button>
        ))}
      </div>

      {/* Scrollable Videos Section */}
      <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : videos.length > 0 ? (
          <ul className="flex space-x-4">
            {videos.map((video) => (
              <li
                key={video.videoId}
                className="flex-shrink-0 w-72 h-64 bg-white p-4 rounded-lg transition"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold truncate">{video.title}</h3>
                <p className="text-gray-600 line-clamp-2">{video.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  Watch on YouTube
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No videos found for "{activeQuery}".</p>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
