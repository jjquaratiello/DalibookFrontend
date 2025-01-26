import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import WordCloud from "react-wordcloud";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Showcase = () => {
  const [members, setMembers] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [traditionData, setTraditionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const membersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`);
        const yearAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/year`);
        const roleAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/role`); // Example endpoint for roles

        setMembers(membersResponse.data.reverse()); // Show latest members first
        setYearData(yearAggregate.data);
        setRoleData(roleAggregate.data);

        // Extract traditions for word cloud
        const traditions = membersResponse.data
          .map((member) => member.dartmouthTradition)
          .filter(Boolean); // Filter out undefined or null traditions
        const traditionCounts = {};
        traditions.forEach((tradition) => {
          traditionCounts[tradition] = (traditionCounts[tradition] || 0) + 1;
        });
        setTraditionData(
          Object.entries(traditionCounts).map(([text, value]) => ({ text, value }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateYearChartData = () => ({
    labels: yearData.map((entry) => entry._id || "Unknown"),
    datasets: [
      {
        label: "Members by Year",
        data: yearData.map((entry) => entry.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const generateRoleChartData = () => ({
    labels: roleData.map((entry) => entry._id),
    datasets: [
      {
        label: "Members by Role",
        data: roleData.map((entry) => entry.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
      },
    ],
  });

  const wordCloudOptions = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [12, 50],
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Member Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Members by Graduation Year</h2>
          <Bar data={generateYearChartData()} />
        </div>

        <div className="p-4 bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Members by Role</h2>
          <Bar data={generateRoleChartData()} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Favorite Traditions Word Cloud</h2>
          <div className="w-full h-64">
            <WordCloud words={traditionData} options={wordCloudOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Members</h2>
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Year</th>
              <th className="border border-gray-300 p-2">Major</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Quote</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-100 transition">
                <td className="border border-gray-300 p-2">
                  <img
                    src={member.picture || "/avatar.jpg"}
                    alt={member.name || "Member"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">{member.name || "N/A"}</td>
                <td className="border border-gray-300 p-2">{member.year || "N/A"}</td>
                <td className="border border-gray-300 p-2">{member.major || "N/A"}</td>
                <td className="border border-gray-300 p-2">
                  {member.dev
                    ? "Developer"
                    : member.des
                    ? "Designer"
                    : member.pm
                    ? "Product Manager"
                    : "Other"}
                </td>
                <td className="border border-gray-300 p-2">{member.quote || "No quote"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Showcase;
