import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashMain from "../components/DashMain";

interface DashboardProps {
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

interface DashboardNavProps {
  userEmail: string;
  handleLogout: () => void;
  handleNavClick: (tabId: string) => void;
  activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, setUserEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/dashboard/", "") || "dashboard"
  );

  useEffect(() => {
    setActiveTab(location.pathname.replace("/dashboard/", "") || "dashboard");
  }, [location.pathname]);

  const handleLogout = () => {
    setUserEmail(null);
    navigate("/");
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    // navigate(`/dashboard/${tabId}`);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardNav
        userEmail={userEmail}
        handleLogout={handleLogout}
        handleNavClick={handleNavClick}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashMain activeTab={activeTab} />
      </div>
    </div>
  );
};

// Sidebar Navigation Component
const DashboardNav: React.FC<DashboardNavProps> = ({
  userEmail,
  handleLogout,
  handleNavClick,
  activeTab,
}) => {
  return (
    <div className="h-full w-1/5 min-w-[250px] p-4 bg-gradient-to-b from-black via-gray-900 to-amber-800 text-white flex flex-col justify-between">
      <div>
        {/* User Profile Card */}
        <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg shadow-lg mb-6">
          <img
            src="https://i.pravatar.cc/50"
            alt="User Avatar"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div className="flex-1 max-w-full overflow-hidden">
            {/* Ensure proper wrapping of long text */}
            <p className="text-sm font-medium break-words">{userEmail}</p>
            <span className="text-xs text-gray-300">
              {/* Ensure this doesn't overflow */}User
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3 dashNav">
          <p className="text-gray-300">Dashboard Links</p>
          <button
            onClick={() => handleNavClick("dashboard")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "dashboard" ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("settings")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "settings" ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => handleNavClick("profile")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "profile" ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            Profile
          </button>

          {/* Exam Bank Section */}
          <p className="text-gray-300 mt-6">Exam Bank</p>
          <button
            onClick={() => handleNavClick("questionRepository")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "questionRepository"
                ? "bg-white/20"
                : "hover:bg-white/20"
            }`}
          >
            Question Repository
          </button>
          <button
            onClick={() => handleNavClick("examBuilder")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "examBuilder" ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            Exam Builder
          </button>
          <button
            onClick={() => handleNavClick("generateExam")}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeTab === "generateExam" ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            Generate Exam
          </button>
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
