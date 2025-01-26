import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";

const Showcase= () => {
  const [members, setMembers] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const membersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`);
        const yearAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/year`);
        const majorAggregate = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/aggregate/major`);

        setMembers(membersResponse.data);
        setYearData(yearAggregate.data);
        setMajorData(majorAggregate.data);
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

  const generateMajorChartData = () => ({
    labels: majorData.map((entry) => entry._id || "Unknown"),
    datasets: [
      {
        label: "Members by Major",
        data: majorData.map((entry) => entry.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
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

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Members by Graduation Year</h2>
          <Bar data={generateYearChartData()} />
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Members by Major</h2>
          <Pie data={generateMajorChartData()} />
        </div>
      </div>

      {/* Groups Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Members</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Year</th>
              <th className="border border-gray-300 p-2">Major</th>
              <th className="border border-gray-300 p-2">Quote</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td className="border border-gray-300 p-2">{member.name || "N/A"}</td>
                <td className="border border-gray-300 p-2">{member.year || "N/A"}</td>
                <td className="border border-gray-300 p-2">{member.major || "N/A"}</td>
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
