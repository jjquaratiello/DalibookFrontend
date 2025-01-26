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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Showcase = () => {
  const [members, setMembers] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const membersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`);
        const yearAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/year`);
        const roleAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/role`); // Example endpoint for roles

        setMembers(membersResponse.data.reverse()); 
        setYearData(yearAggregate.data);
        setRoleData(roleAggregate.data);
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

      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Members Directory</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl border-2 p-4 flex flex-col items-center space-y-4"
            >
              {/* Profile Picture */}
              <img
                src={member.picture || "/avatar.jpg"}
                alt={member.name || "Member"}
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />

              {/* Member Info */}
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {member.name || "N/A"}
                </h2>
                <p className="text-sm text-gray-500">{member.year || "Year Unknown"}</p>
                <p className="text-sm text-gray-500">{member.major || "Major Unknown"}</p>
                <p className="text-sm text-gray-500">
                  {member.dev
                    ? "Developer"
                    : member.des
                    ? "Designer"
                    : member.pm
                    ? "Product Manager"
                    : "Other"}
                </p>
              </div>

              {/* Quote */}
              <div className="text-sm text-gray-600 italic line-clamp-3">
                <p>"{member.quote || "No quote provided"}"</p>
              </div>

              {/* Fun Fact */}
              <div className="text-sm text-gray-700 line-clamp-3">
                <strong>Fun Fact:</strong> {member.funFact || "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Showcase;
