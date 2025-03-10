import React from "react";
import DashboardHome from "../pages/DashboardHome";
import Profile from "../pages/Profile";
import ExamBuilder from "../pages/ExamBuilder";
import GenerateExam from "../pages/GenerateExam";
import QuestionRepository from "../pages/QuestionRepository";
import Settings from "../pages/Settings";

interface DashMainProps {
  activeTab: string;
}

const DashPages: { [key: string]: React.JSX.Element } = {
  dashboard: <DashboardHome />,
  profile: <Profile />,
  examBuilder: <ExamBuilder />,
  generateExam: <GenerateExam />,
  questionRepository: <QuestionRepository />,
  settings: <Settings />,
};

const DashMain: React.FC<DashMainProps> = ({ activeTab }) => {
  return (
    <div className="flex-auto min-h-full w-full overflow-y-auto">
      {/* Dynamic Content Based on Active Tab */}
      <div className="bg-white rounded-lg shadow-md">
        {DashPages[activeTab] || <DashboardHome />}
      </div>
    </div>
  );
};

export default DashMain;
