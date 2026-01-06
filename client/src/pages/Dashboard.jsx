import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import {
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Users,
  Activity,
  Shield,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit2,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const stats = [
    {
      label: "Total Sessions",
      value: "156",
      icon: Activity,
      color: "blue",
      change: "+12%",
    },
    {
      label: "Active Users",
      value: "2.4K",
      icon: Users,
      color: "green",
      change: "+8%",
    },
    {
      label: "Security Score",
      value: "98%",
      icon: Shield,
      color: "purple",
      change: "+2%",
    },
    {
      label: "Uptime",
      value: "99.9%",
      icon: TrendingUp,
      color: "orange",
      change: "0%",
    },
  ];

  const recentActivities = [
    { action: "Login successful", time: "2 minutes ago", ip: "192.168.1.1" },
    { action: "Profile updated", time: "1 hour ago", ip: "192.168.1.1" },
    { action: "Password changed", time: "2 days ago", ip: "192.168.1.2" },
    { action: "Security check passed", time: "1 week ago", ip: "192.168.1.1" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  WanderOn
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role || "User"}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "overview"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.first_name}! 👋
                </h1>
                <p className="text-blue-100">
                  Here's what's happening with your account today
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="card group hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                        <stat.icon
                          className={`w-6 h-6 text-${stat.color}-600`}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          stat.change.startsWith("+")
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {activity.action}
                          </div>
                          <div className="text-sm text-gray-500">
                            IP: {activity.ip}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Profile Information
                </h1>
                <p className="text-gray-600">
                  Manage your personal information and account details
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="card text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user?.first_name} {user?.last_name}
                    </h3>
                    <p className="text-gray-600 mb-2">@{user?.username}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </div>
                    <button
                      onClick={() => setIsEditProfileOpen(true)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Details Card */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      Account Details
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">
                            {user?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Username</div>
                          <div className="font-medium text-gray-900">
                            {user?.username}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Role</div>
                          <div className="font-medium text-gray-900 capitalize">
                            {user?.role || "User"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">
                            Member Since
                          </div>
                          <div className="font-medium text-gray-900">
                            {new Date(user?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">
                            Last Login
                          </div>
                          <div className="font-medium text-gray-900">
                            {user?.lastLogin
                              ? new Date(user.lastLogin).toLocaleString("en-US")
                              : "Just now"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Settings
                </h1>
                <p className="text-gray-600">
                  Manage your account preferences and security settings
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Security
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        Change Password
                      </div>
                      <div className="text-sm text-gray-500">
                        Update your password regularly
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900 mb-1">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-gray-500">
                        Add an extra layer of security
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-900 mb-1">
                        Active Sessions
                      </div>
                      <div className="text-sm text-gray-500">
                        Manage your logged-in devices
                      </div>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          Email Notifications
                        </div>
                        <div className="text-sm text-gray-500">
                          Receive email updates
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          Marketing Emails
                        </div>
                        <div className="text-sm text-gray-500">
                          Receive promotional content
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">
                          Security Alerts
                        </div>
                        <div className="text-sm text-gray-500">
                          Get notified of suspicious activity
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-2 border-red-200 bg-red-50">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  These actions are irreversible. Please be careful.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
