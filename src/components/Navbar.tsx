import React from "react";
import RoleToggle from "./RoleToggle";
import { BookOpen, Bell, User, Calendar, LogOut, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  activeRole?: "student" | "tutor";
  onRoleChange?: (role: "student" | "tutor") => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  notificationCount?: number;
}

const Navbar = ({
  activeRole = "student",
  onRoleChange = () => {},
  activeTab = "overview",
  onTabChange = () => {},
  onLogout = () => {},
  notificationCount = activeRole === "tutor" ? 1 : 1,
}: NavbarProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const roleColorClass =
    activeRole === "tutor" ? "tutor-primary-text" : "student-primary-text";
  const roleBgClass =
    activeRole === "tutor" ? "tutor-primary-bg" : "student-primary-bg";
  const activeTabBgClass =
    activeRole === "tutor" ? "bg-purple-50" : "bg-orange-50";
  const activeTabTextClass =
    activeRole === "tutor" ? "text-[#5E17EB]" : "text-[#F37221]";

  return (
    <header
      className={`bg-white shadow-sm py-4 px-6 sticky top-0 z-50 border-b-2 ${activeRole === "tutor" ? "border-[#5E17EB]" : "border-[#F37221]"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className={`text-2xl font-bold ${roleColorClass}`}>helpii</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => onTabChange("missions")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === "missions" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600 hover:text-blue-700"}`}
          >
            <Calendar size={18} />
            <span>{t("navbar.yourMissions")}</span>
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === "profile" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600 hover:text-blue-700"}`}
          >
            <User size={18} />
            <span>{t("navbar.profile")}</span>
          </button>
          <button
            onClick={() => onTabChange("notifications")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${activeTab === "notifications" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600 hover:text-blue-700"}`}
          >
            <Bell size={18} />
            <span>{t("navbar.notifications")}</span>
            {notificationCount > 0 && (
              <div className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </div>
            )}
          </button>
          <div className="relative group">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-gray-600 hover:${activeTabTextClass}`}
            >
              <Globe size={18} />
              <span>{t("navbar.language")}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
              <button
                onClick={() => changeLanguage("en")}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${i18n.language === "en" ? "font-bold" : ""}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("de")}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${i18n.language === "de" ? "font-bold" : ""}`}
              >
                Deutsch
              </button>
            </div>
          </div>
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-gray-600 hover:${activeTabTextClass}`}
          >
            <LogOut size={18} />
            <span>{t("navbar.logout")}</span>
          </button>
        </nav>

        {/* Role Toggle */}
        <RoleToggle activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};

export default Navbar;
