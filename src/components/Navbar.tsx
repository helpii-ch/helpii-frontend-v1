import React, { useState, useEffect, useRef } from "react";
import RoleToggle from "./RoleToggle";
import {
  BookOpen,
  Bell,
  User,
  Calendar,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  activeRole?: "needer" | "helper";
  onRoleChange?: (role: "needer" | "helper") => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  notificationCount?: number;
}

const Navbar = ({
  activeRole = "needer",
  onRoleChange = () => {},
  activeTab = "overview",
  onTabChange = () => {},
  onLogout = () => {},
  notificationCount = activeRole === "helper" ? 1 : 1,
}: NavbarProps) => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const roleColorClass =
    activeRole === "helper" ? "helper-primary-text" : "needer-primary-text";
  const roleBgClass =
    activeRole === "helper" ? "helper-primary-bg" : "needer-primary-bg";
  const activeTabBgClass =
    activeRole === "helper" ? "bg-purple-50" : "bg-orange-50";
  const activeTabTextClass =
    activeRole === "helper" ? "text-[#5E17EB]" : "text-[#F37221]";

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle menu item click
  const handleMenuItemClick = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`bg-white shadow-sm py-4 px-6 sticky top-0 z-50 border-b-2 ${activeRole === "helper" ? "border-[#5E17EB]" : "border-[#F37221]"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => onTabChange("missions")}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src="/public/Logo_d.svg"
              alt="Helpii Logo"
              className="h-8 w-auto"
            />
          </button>
        </div>


        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Role Toggle */}
        <div className="hidden md:block">
          <RoleToggle activeRole={activeRole} onRoleChange={onRoleChange} />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed inset-0 z-50 bg-white bg-opacity-95 transform transition-transform duration-300 ease-in-out"
        >
          <div className="flex flex-col h-full p-6 pt-20">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <RoleToggle
                activeRole={activeRole}
                onRoleChange={(role) => {
                  onRoleChange(role);
                  setMobileMenuOpen(false);
                }}
              />
            </div>

            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleMenuItemClick("missions")}
                className={`flex items-center gap-2 px-3 py-4 rounded-md transition-colors ${activeTab === "missions" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600"}`}
              >
                <Calendar size={20} />
                <span className="text-lg">{t("navbar.yourMissions")}</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("profile")}
                className={`flex items-center gap-2 px-3 py-4 rounded-md transition-colors ${activeTab === "profile" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600"}`}
              >
                <User size={20} />
                <span className="text-lg">{t("navbar.profile")}</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("notifications")}
                className={`flex items-center gap-2 px-3 py-4 rounded-md transition-colors ${activeTab === "notifications" ? `${activeTabBgClass} ${activeTabTextClass}` : "text-gray-600"}`}
              >
                <Bell size={20} />
                <span className="text-lg">{t("navbar.notifications")}</span>
                {notificationCount > 0 && (
                  <div className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </div>
                )}
              </button>

              <div className="py-4 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    {t("navbar.language")}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`px-4 py-2 rounded-md ${i18n.language === "en" ? "bg-gray-100 font-bold" : ""}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("de")}
                      className={`px-4 py-2 rounded-md ${i18n.language === "de" ? "bg-gray-100 font-bold" : ""}`}
                    >
                      Deutsch
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-4 rounded-md text-red-600 mt-auto"
              >
                <LogOut size={20} />
                <span className="text-lg">{t("navbar.logout")}</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
