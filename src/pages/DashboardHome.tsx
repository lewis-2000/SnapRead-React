import React, { useEffect, useState } from "react";
import axios from "axios";

interface DashboardProps {
  userEmail: string;
}

const DashboardHome: React.FC<DashboardProps> = ({ userEmail }) => {
  const [stats, setStats] = useState({
    questionCount: 0,
    answerCount: 0,
    examCount: 0,
    markingSchemeCount: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/stats/");
        setStats(response.data);
      } catch (err) {
        setError("Failed to load stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-full bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Manage your exams and questions efficiently.
      </p>

      {/* User Account Summary */}
      <div className="mt-6 p-6 border rounded-lg bg-gray-100 shadow-md flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {userEmail.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Account Summary</h2>
          <p className="text-gray-700">
            <strong>Email:</strong> {userEmail}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <p className="mt-6 text-gray-500">Loading stats...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Questions Created"
            count={stats.questionCount}
            bgColor="bg-blue-500"
          />
          <StatCard
            title="Answers Stored"
            count={stats.answerCount}
            bgColor="bg-green-500"
          />
          <StatCard
            title="Exams Generated"
            count={stats.examCount}
            bgColor="bg-yellow-500"
          />
          <StatCard
            title="Marking Schemes"
            count={stats.markingSchemeCount}
            bgColor="bg-red-500"
          />
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard: React.FC<{ title: string; count: number; bgColor: string }> = ({
  title,
  count,
  bgColor,
}) => (
  <div className={`p-6 border rounded-lg shadow-md text-white ${bgColor}`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default DashboardHome;
