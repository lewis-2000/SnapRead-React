import React from "react";
import DashboardHome from "../pages/DashboardHome";
import Profile from "../pages/Profile";
import ExamBuilder from "../pages/ExamBuilder";
import GenerateExam from "../pages/GenerateExam";
import QuestionRepository from "../pages/QuestionRepository";
import Settings from "../pages/Settings";

interface DashMainProps {
  activeTab: string;
  userEmail: string;
}

const DashPages = (
  userEmail: string
): { [key: string]: React.JSX.Element } => ({
  dashboard: <DashboardHome userEmail={userEmail} />,
  profile: <Profile />,
  examBuilder: <ExamBuilder />,
  generateExam: <GenerateExam />,
  questionRepository: <QuestionRepository />,
  settings: <Settings />,
});

const DashMain: React.FC<DashMainProps> = ({ activeTab, userEmail }) => {
  return (
    <div className="flex-auto min-h-full w-full overflow-y-auto">
      {/* Dynamic Content Based on Active Tab */}
      <div className="bg-white rounded-lg ">
        {DashPages(userEmail)[activeTab] || (
          <DashboardHome userEmail={userEmail} />
        )}
      </div>
    </div>
  );
};

export default DashMain;
