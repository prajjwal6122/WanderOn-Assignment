import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ChangeUsernameModal({
  isOpen,
  onClose,
  currentUsername,
}) {
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const handleChange = (e) => {
    setNewUsername(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (newUsername === currentUsername) {
      setError("New username must be different from current username");
      return;
    }

    if (newUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (newUsername.length > 30) {
      setError("Username must not exceed 30 characters");
      return;
    }

    // Validate alphanumeric and underscores only
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setLoading(true);

    try {
      const response = await updateProfile({
        username: newUsername,
      });

      if (response.success) {
        setSuccess("Username changed successfully!");
        setNewUsername("");
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to change username");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Change Username</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Current Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Username
            </label>
            <div className="px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-900 font-semibold">
              {currentUsername}
            </div>
          </div>

          {/* New Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={handleChange}
              required
              placeholder="Enter your new username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              3-30 characters, alphanumeric and underscores only
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Changing..." : "Change Username"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
