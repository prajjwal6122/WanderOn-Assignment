import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [step, setStep] = useState(1); // Step 1: Warning, Step 2: Confirm

  const handleConfirmText = (e) => {
    setConfirmed(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleDelete = async () => {
    if (confirmed !== "DELETE MY ACCOUNT") {
      setError("Please type 'DELETE MY ACCOUNT' to confirm");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use globally configured axios instance from AuthContext
      const response = await axios.delete("/api/auth/deleteaccount", {
        data: { password },
      });

      if (response.data.success) {
        // Logout and redirect to login after deletion
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 1000);
      } else {
        setError(response.data.message || "Failed to delete account");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An error occurred while deleting your account";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-red-900">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Warning Section */}
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  This action{" "}
                  <span className="font-bold text-red-600">
                    cannot be undone
                  </span>
                  . We will:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span>
                      Permanently delete your account and all associated data
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span>Cancel any active bookings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span>Remove you from all groups and communities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span>This action cannot be reversed</span>
                  </li>
                </ul>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Section */}
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Enter your password to confirm account deletion:
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition outline-none"
                />

                <p className="text-sm text-gray-700 mt-4">
                  To confirm deletion, please type the following text:
                </p>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="font-mono font-bold text-gray-900">
                    DELETE MY ACCOUNT
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Type the confirmation text"
                  value={confirmed}
                  onChange={handleConfirmText}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition outline-none"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(1);
                    setConfirmed("");
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={
                    loading || confirmed !== "DELETE MY ACCOUNT" || !password
                  }
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
