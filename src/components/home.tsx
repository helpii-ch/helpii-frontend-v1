import React, { useState } from "react";
import Navbar from "./Navbar";
import TutorFeed from "./TutorFeed";
import StudentDashboard from "./StudentDashboard";
import { useTranslation } from "react-i18next";

type UserRole = "tutor" | "student";
type ActiveTab = "missions" | "profile" | "notifications" | "overview";

const Home = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [activeTab, setActiveTab] = useState<ActiveTab>("missions");
  const [notificationCount, setNotificationCount] = useState<number>(
    currentRole === "tutor" ? 1 : 1,
  );

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Reset notification count when switching roles
    setNotificationCount(role === "tutor" ? 1 : 1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
    // Clear notifications when visiting the notifications tab
    if (tab === "notifications") {
      setNotificationCount(0);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("User logged out");
    // Clear any stored user data
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    // In a real app, you would redirect to login page
    window.location.href = "/login";
  };

  // Render content based on active tab
  const renderContent = () => {
    // Main dashboard is now directly TutorFeed or StudentDashboard
    if (activeTab === "missions") {
      return currentRole === "tutor" ? <TutorFeed /> : <StudentDashboard />;
    }

    if (activeTab === "profile") {
      // Import profile components dynamically to avoid circular dependencies
      const TutorProfile = React.lazy(() => import("./profile/TutorProfile"));
      const StudentProfile = React.lazy(
        () => import("./profile/StudentProfile"),
      );

      return (
        <React.Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              Loading profile...
            </div>
          }
        >
          {currentRole === "tutor" ? (
            <TutorProfile
              activeRole={currentRole}
              onTabChange={handleTabChange}
            />
          ) : (
            <StudentProfile
              activeRole={currentRole}
              onTabChange={handleTabChange}
            />
          )}
        </React.Suspense>
      );
    }

    if (activeTab === "notifications") {
      return (
        <div className="container mx-auto px-4 py-8">
          <h2
            className={`text-3xl font-bold mb-4 ${currentRole === "tutor" ? "text-[#5E17EB]" : "text-[#F37221]"}`}
          >
            {t("notifications.title")}
          </h2>
          <p className="text-gray-600 mb-8">{t("notifications.subtitle")}</p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {currentRole === "tutor" ? (
              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 mb-4">
                <h3 className="font-medium text-green-800">
                  {t("notifications.tutor.missionAccepted")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("notifications.tutor.acceptedMessage")}
                </p>
              </div>
            ) : (
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 mb-4">
                <h3 className="font-medium text-blue-800">
                  {t("notifications.student.newMatch")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("notifications.student.matchMessage")}
                </p>
              </div>
            )}
            <p className="text-center text-gray-500 py-4">
              {t("notifications.noMore")}
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === "overview") {
      return (
        <div className="container mx-auto px-4 py-8">
          <h2
            className={`text-3xl font-bold mb-4 ${currentRole === "tutor" ? "text-[#5E17EB]" : "text-[#F37221]"}`}
          >
            {t("home.overview")}
          </h2>
          <p className="text-gray-600 mb-8">{t("home.welcomeMessage")}</p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-center text-gray-500 py-8">
              {currentRole === "tutor"
                ? t("home.tutorMessage")
                : t("home.studentMessage")}
            </p>
          </div>
        </div>
      );
    }

    return currentRole === "tutor" ? <TutorFeed /> : <StudentDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Montserrat']">
      {/* Navigation Bar */}
      <Navbar
        activeRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        notificationCount={notificationCount}
      />

      {/* Main content area */}
      <main className="pt-6 pb-12">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">helpii</h3>
              <p className="text-gray-300 text-sm">{t("footer.tagline")}</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t("footer.aboutUs")}
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t("footer.privacyPolicy")}
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t("footer.termsOfService")}
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} helpii.{" "}
            {t("footer.allRightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
