import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setValidationErrors([]);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      setLoading(false);
      return;
    }

    const { confirm_password, ...registerData } = formData;
    const UserData = { confirm_password, ...registerData };
    const result = await register(UserData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
      // Extract validation errors if available
      if (result.errors) {
        setValidationErrors(result.errors);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join thousands of users in our secure platform
          </p>
        </div>

        {/* Registration Card */}
        <div className="card">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-semibold mb-3">
                    {error}
                  </p>

                  {/* Validation Error Details */}
                  {validationErrors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs font-semibold text-red-700 mb-2 uppercase">
                        Why did it fail?
                      </p>
                      <ul className="space-y-2">
                        {validationErrors.map((err, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-red-700 flex items-start gap-2"
                          >
                            <span className="text-red-600 font-bold mt-0.5">
                              •
                            </span>
                            <span>
                              <strong>{err.field}:</strong> {err.message}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="input-field"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordValidation.minLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.minLength ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    At least 6 characters
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordValidation.hasUpper
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.hasUpper ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    One uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordValidation.hasLower
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.hasLower ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    One lowercase letter
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.hasNumber ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    One number
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      passwordValidation.hasSpecial
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordValidation.hasSpecial ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    One special character (!@#$%^&*...)
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <label className="ml-3 text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
