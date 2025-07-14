import React, { useState } from "react";
import Navbar from "./Navbar";
import TutorFeed from "./HelperFeed.tsx";
import StudentDashboard from "./NeederDashboard.tsx";
import { useTranslation } from "react-i18next";

type UserRole = "helper" | "needer";
type ActiveTab = "missions" | "profile" | "notifications" | "overview";

const Home = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState<UserRole>("needer");
  const [activeTab, setActiveTab] = useState<ActiveTab>("missions");
  const [showAboutUs, setShowAboutUs] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(
    currentRole === "helper" ? 1 : 1,
  );

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Reset notification count when switching roles
    setNotificationCount(role === "helper" ? 1 : 1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
    setShowAboutUs(false);
    // Clear notifications when visiting the notifications tab
    if (tab === "notifications") {
      setNotificationCount(0);
    }
  };

  const handleAboutUsClick = () => {
    setShowAboutUs(true);
  };

  const handleBackToHome = () => {
    setShowAboutUs(false);
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
    // Show About Us content if requested
    if (showAboutUs) {
      return (
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackToHome}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
            {/* Our Team Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Our Team</h3>
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Team Photo</span>
                </div>
                <p className="text-gray-600">
                  [Team picture placeholder - Coming soon!]
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">about us</h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p className="text-xl font-medium text-gray-900 mb-6">
                helpii connects needers with helpers.
              </p>

              <p>
                We firmly believe in the power of helping — both from an
                economic and a social perspective. Everyone is good at
                something. And that talent — even without professional training
                — can be used to support others while earning a little extra on
                the side.
              </p>

              <p>
                But helping means more than just getting a job done: It's an
                opportunity to connect, do good, and meet new people.
              </p>

              <p>That's exactly the idea that inspired helpii.</p>

              <p>
                We're starting small — with a clear focus on one specific need:
                tutoring. But we believe that help knows no boundaries.
              </p>

              <p>
                That's why we're building a platform where you can find support
                for all kinds of needs — easily, with trust, and a human touch.
              </p>

              <p>
                Whether you need help or want to offer it, helpii is where
                people come together to move forward — together.
              </p>

              <p className="text-xl font-medium text-gray-900 mt-8">
                Simple as that.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Main dashboard is now directly HelperFeed or NeederDashboard
    if (activeTab === "missions") {
      return currentRole === "helper" ? <TutorFeed /> : <StudentDashboard />;
    }

    if (activeTab === "profile") {
      // Import profile components dynamically to avoid circular dependencies
      const HelperProfile = React.lazy(() => import("./profile/TutorProfile"));
      const NeederProfile = React.lazy(
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
          {currentRole === "helper" ? (
            <HelperProfile
              activeRole={currentRole}
              onTabChange={handleTabChange}
            />
          ) : (
            <NeederProfile
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
            className={`text-3xl font-bold mb-4 ${currentRole === "helper" ? "text-[#5E17EB]" : "text-[#F37221]"}`}
          >
            {t("notifications.title")}
          </h2>
          <p className="text-gray-600 mb-8">{t("notifications.subtitle")}</p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {currentRole === "helper" ? (
              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 mb-4">
                <h3 className="font-medium text-green-800">
                  {t("notifications.helper.missionAccepted")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("notifications.helper.acceptedMessage")}
                </p>
              </div>
            ) : (
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 mb-4">
                <h3 className="font-medium text-blue-800">
                  {t("notifications.needer.newMatch")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("notifications.needer.matchMessage")}
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
            className={`text-3xl font-bold mb-4 ${currentRole === "helper" ? "text-[#5E17EB]" : "text-[#F37221]"}`}
          >
            {t("home.overview")}
          </h2>
          <p className="text-gray-600 mb-8">{t("home.welcomeMessage")}</p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-center text-gray-500 py-8">
              {currentRole === "helper"
                ? t("home.helperMessage")
                : t("home.neederMessage")}
            </p>
          </div>
        </div>
      );
    }

    return currentRole === "helper" ? <TutorFeed /> : <StudentDashboard />;
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
              <p className="text-gray-300 text-sm">
                connecting needers with helpers. simple as that.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAboutUsClick}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t("footer.aboutUs")}
              </button>
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
