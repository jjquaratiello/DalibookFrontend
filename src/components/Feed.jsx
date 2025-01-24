import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ProfileView from "./ProfileView";
import BottomBar from "./BottomBar";

const Feed = ({ onSelectMember }) => {
  const [posts, setPosts] = useState([]); // Ensures posts is always an array
  const [content, setContent] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load
  const [selectedMember, setSelectedMember] = useState(null); // State for selected member
  const [isProfileVisible, setIsProfileVisible] = useState(false); // State for profile visibility

  // Fetch posts from API
  const fetchPosts = async (page = 1) => {
    if (loading || !hasMorePosts) return; // Prevent multiple fetches while loading or if no more posts
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/feed?page=${page}`);
      const newPosts = response.data.posts || [];
      
      // Only update if there are new posts, and no duplicates
      setPosts((prevPosts) => {
        const uniquePosts = newPosts.filter(
          (newPost) => !prevPosts.some((post) => post._id === newPost._id)
        );
        return [...prevPosts, ...uniquePosts]; // Append unique new posts
      });

      // Update state for next page
      setPage(page);
      setHasMorePosts(newPosts.length > 0); // If no new posts, stop infinite scroll
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Load initial posts
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && // Trigger fetch when near bottom
      hasMorePosts && 
      !loading
    ) {
      fetchPosts(page + 1); // Load next page
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMorePosts]);

  // Submit a new post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/feed", {
        content,
        user,
      });
      setPosts([response.data, ...posts]); // Prepend the new post
      setContent("");
      setUser("");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/feed/${id}/like`);
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/feed/${id}/dislike`);
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };

  // Handle profile selection
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setIsProfileVisible(true);
  };

  // Handle profile close
  const handleCloseProfile = () => {
    setIsProfileVisible(false);
  };

  return (
    <div className="relative"> 
      {/* Create Post Input */}
      <div className="mb-96">
      <div className="border-b border-gray-300 p-4 bg-white">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full text-black text-3xl py-2 rounded-md focus:outline-none"
          />
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-black text-2xl py-2 rounded-md focus:outline-none resize-none"
            rows="3"
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className={`divide-y divide-gray-300 ${isProfileVisible ? 'mr-80' : ''}`}>
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-800 font-semibold">{post.user || "Anonymous"}</p>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <FaThumbsUp />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => handleDislike(post._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <FaThumbsDown />
                  <span>{post.dislikes}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-700 mt-2">{post.content}</p>
          </div>
        ))}
        {loading && <p className="text-center text-gray-500 py-4">Loading more posts...</p>}
        {!hasMorePosts && <p className="text-center text-gray-500 py-4">No more posts to load.</p>}
      </div>

      {/* Profile View */}
      <div
        className={`fixed top-0 right-0 h-[calc(100vh-10rem)] w-80 bg-white shadow-lg transform transition-transform duration-300 ${
          isProfileVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ bottom: '10rem' }} // Ensure it is above the bottom bar
      >
        <button
          onClick={handleCloseProfile}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
        {selectedMember && (
          <ProfileView member={selectedMember} />
        )}
      </div>

      </div>

      <BottomBar />
    </div>
  );
};

export default Feed;
