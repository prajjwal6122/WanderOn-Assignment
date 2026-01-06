import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ChangeUsernameModal from "../components/ChangeUsernameModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import {
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Shield,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit2,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const internationalTrips = [
    {
      name: "Europe",
      startingPrice: "Rs. 1,49,999/-",
      image:
        "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Eiffel Tower, Paris",
    },
    {
      name: "Vietnam",
      startingPrice: "Rs. 59,999/-",
      image:
        "https://images.pexels.com/photos/3747435/pexels-photo-3747435.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Halong Bay, Vietnam",
    },
    {
      name: "Bali",
      startingPrice: "Rs. 49,999/-",
      image:
        "https://images.pexels.com/photos/1659999/pexels-photo-1659999.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1514414376556-16a66bb59dba?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Tanah Lot Temple, Bali",
    },
    {
      name: "Thailand",
      startingPrice: "Rs. 44,999/-",
      image:
        "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1508701115722-9c248ba55df3?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Phi Phi Islands, Thailand",
    },
    {
      name: "Japan",
      startingPrice: "Rs. 1,29,999/-",
      image:
        "https://images.pexels.com/photos/442571/pexels-photo-442571.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1522383150241-6c85cf17589f?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Mount Fuji, Japan",
    },
    {
      name: "Maldives",
      startingPrice: "Rs. 74,999/-",
      image:
        "https://images.pexels.com/photos/1618519/pexels-photo-1618519.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Tropical Paradise, Maldives",
    },
  ];

  const indiaTrips = [
    {
      name: "Rajasthan",
      startingPrice: "Rs. 12,999/-",
      image:
        "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1571253056917-d21b34948c3f?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Hawa Mahal, Jaipur",
    },
    {
      name: "Leh Ladakh",
      startingPrice: "Rs. 21,999/-",
      image:
        "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1516426122078-8023e26305d7?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Pangong Tso Lake, Ladakh",
    },
    {
      name: "Meghalaya",
      startingPrice: "Rs. 21,499/-",
      image:
        "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1605276374104-dee2a0bb3e81?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Khasi Hills, Meghalaya",
    },
    {
      name: "Kashmir",
      startingPrice: "Rs. 24,499/-",
      image:
        "https://images.pexels.com/photos/708175/pexels-photo-708175.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Dal Lake, Kashmir",
    },
  ];

  const honeymoonTrips = [
    {
      name: "Bali",
      startingPrice: "Rs. 44,999/-",
      image:
        "https://images.pexels.com/photos/1659999/pexels-photo-1659999.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Romance in Paradise, Bali",
    },
    {
      name: "Maldives",
      startingPrice: "Rs. 74,999/-",
      image:
        "https://images.pexels.com/photos/1618519/pexels-photo-1618519.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Overwater Villas, Maldives",
    },
    {
      name: "Thailand",
      startingPrice: "Rs. 44,999/-",
      image:
        "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1537144191519-689ad6662558?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Tropical Beaches, Thailand",
    },
    {
      name: "Kashmir",
      startingPrice: "Rs. 24,499/-",
      image:
        "https://images.pexels.com/photos/708175/pexels-photo-708175.jpeg?w=800&h=500&fit=crop&auto=compress",
      fallbackImage:
        "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=500&fit=crop&q=80&auto=format",
      description: "Heaven on Earth, Kashmir",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo in Corner */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
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
                  placeholder="Search trips and destinations..."
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
                  <div className="text-xs text-gray-500">Traveler</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-semibold">
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
              <span className="font-medium">Explore Trips</span>
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
              <span className="font-medium">My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "bookings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">My Bookings</span>
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
            <div className="space-y-12">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-3xl p-12 text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-3">
                  Welcome back, {user?.first_name}! 🌍
                </h1>
                <p className="text-blue-50 text-lg">
                  Discover the world, one destination at a time
                </p>
              </div>

              {/* International Trips Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      International Trips
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Explore destinations across the globe
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg">
                    Explore All <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {internationalTrips.map((trip, index) => (
                    <div
                      key={index}
                      className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-blue-400 to-cyan-300">
                        <picture>
                          <img
                            src={trip.image}
                            alt={trip.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = trip.fallbackImage;
                              e.target.onError = () => {
                                e.target.style.display = "none";
                                e.target.parentElement.parentElement.style.backgroundImage =
                                  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)";
                              };
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{trip.name}</h3>
                        <p className="text-blue-100 font-semibold">
                          Starting Price {trip.startingPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* India Trips Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      India Trips
                    </h2>
                    <p className="text-gray-600 mt-1">
                      A journey through time, colour and culture
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg">
                    Explore All <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {indiaTrips.map((trip, index) => (
                    <div
                      key={index}
                      className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-orange-400 to-yellow-300">
                        <picture>
                          <img
                            src={trip.image}
                            alt={trip.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = trip.fallbackImage;
                              e.target.onError = () => {
                                e.target.style.display = "none";
                                e.target.parentElement.parentElement.style.backgroundImage =
                                  "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)";
                              };
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{trip.name}</h3>
                        <p className="text-orange-100 font-semibold">
                          Starting Price {trip.startingPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honeymoon Trips Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Honeymoon Packages
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Where forever begins... together!
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg">
                    Explore All <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {honeymoonTrips.map((trip, index) => (
                    <div
                      key={index}
                      className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-pink-400 to-rose-300">
                        <picture>
                          <img
                            src={trip.image}
                            alt={trip.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = trip.fallbackImage;
                              e.target.onError = () => {
                                e.target.style.display = "none";
                                e.target.parentElement.parentElement.style.backgroundImage =
                                  "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)";
                              };
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{trip.name}</h3>
                        <p className="text-pink-100 font-semibold">
                          Starting Price {trip.startingPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coming Soon Features */}
              <div className="border-4 border-dashed border-blue-300 rounded-2xl p-12 bg-blue-50">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-blue-900 mb-3">
                    More Features Coming Soon! 🚀
                  </h2>
                  <p className="text-blue-700 text-lg">
                    FEATURE NOT YET AVAILABLE - Corporate Tours, Weekend
                    Getaways, Group Trips, and more features are under
                    development and will be available soon!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Profile
                </h1>
                <p className="text-gray-600">
                  Manage your personal information and travel preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="card text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user?.first_name} {user?.last_name}
                    </h3>
                    <p className="text-gray-600 mb-2">@{user?.username}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active Traveler
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
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">
                            Traveler Status
                          </div>
                          <div className="font-medium text-gray-900 capitalize">
                            Premium Explorer
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

          {activeTab === "bookings" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Bookings
                </h1>
                <p className="text-gray-600">
                  View and manage your trip bookings
                </p>
              </div>

              <div className="border-4 border-dashed border-blue-300 rounded-2xl p-12 bg-blue-50 text-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  No Bookings Yet
                </h2>
                <p className="text-blue-700 mb-6">
                  Start your adventure by exploring our amazing destinations!
                </p>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Explore Trips
                </button>
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
                    <button
                      onClick={() => setIsChangeUsernameOpen(true)}
                      className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        Change Username
                      </div>
                      <div className="text-sm text-gray-500">
                        Update your username
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
                          Trip Notifications
                        </div>
                        <div className="text-sm text-gray-500">
                          Get updates on new trips
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
                <button
                  onClick={() => setIsDeleteAccountOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
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
      <ChangeUsernameModal
        isOpen={isChangeUsernameOpen}
        onClose={() => setIsChangeUsernameOpen(false)}
        currentUsername={user?.username}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </div>
  );
}
