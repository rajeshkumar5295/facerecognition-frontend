import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.tsx";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      if (token) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex overflow-hidden relative">
      {/* Full Page Background Animations */}
      <div className="absolute inset-0 z-0">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-blue-500/15"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-40 ${
                i % 3 === 0
                  ? "w-1 h-1 bg-indigo-400"
                  : i % 3 === 1
                  ? "w-0.5 h-0.5 bg-purple-400"
                  : "w-1.5 h-1.5 bg-blue-400"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  2 + Math.random() * 5
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Matrix-like falling particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`matrix-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${30 + Math.random() * 40}%`,
                animation: `matrix-fall ${
                  4 + Math.random() * 6
                }s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Animated Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-indigo-400/25 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 border border-purple-400/25 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-blue-400/25 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border border-indigo-400/25 rounded-lg animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-purple-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute top-10 right-1/4 w-12 h-12 border border-blue-400/30 rounded-lg animate-bounce"></div>

        {/* Additional floating geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 border border-indigo-400/40 rotate-12 animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-purple-400/40 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-1/6 w-10 h-10 border border-blue-400/30 rounded-lg rotate-45 animate-float-slow"></div>
        <div className="absolute top-1/6 right-1/6 w-14 h-14 border border-indigo-400/20 rounded-full animate-spin-reverse"></div>
        <div className="absolute bottom-1/6 left-2/3 w-12 h-12 border border-purple-400/35 rotate-45 animate-pulse-fast"></div>

        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-indigo-400/60 rounded-full animate-orbit"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-orbit-reverse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-400/60 rounded-full animate-orbit-slow"></div>

        {/* Face Recognition Scanning Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-scan-horizontal"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-scan-horizontal-reverse"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent animate-scan-vertical"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/50 to-transparent animate-scan-vertical-reverse"></div>

          {/* Additional diagonal scanning lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-scan-diagonal"></div>
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-400/30 to-transparent animate-scan-diagonal-reverse"></div>

          {/* Pulsing grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/6 left-0 w-full h-px bg-indigo-400/20 animate-pulse-grid"></div>
            <div className="absolute top-2/6 left-0 w-full h-px bg-purple-400/20 animate-pulse-grid"></div>
            <div className="absolute top-3/6 left-0 w-full h-px bg-blue-400/20 animate-pulse-grid"></div>
            <div className="absolute top-4/6 left-0 w-full h-px bg-indigo-400/20 animate-pulse-grid"></div>
            <div className="absolute top-5/6 left-0 w-full h-px bg-purple-400/20 animate-pulse-grid"></div>

            <div className="absolute top-0 left-1/6 w-px h-full bg-indigo-400/20 animate-pulse-grid"></div>
            <div className="absolute top-0 left-2/6 w-px h-full bg-purple-400/20 animate-pulse-grid"></div>
            <div className="absolute top-0 left-3/6 w-px h-full bg-blue-400/20 animate-pulse-grid"></div>
            <div className="absolute top-0 left-4/6 w-px h-full bg-indigo-400/20 animate-pulse-grid"></div>
            <div className="absolute top-0 left-5/6 w-px h-full bg-purple-400/20 animate-pulse-grid"></div>
          </div>
        </div>
      </div>

      {/* Left Side - Image Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Main Face Recognition Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-lg">
            {/* SVG Face Recognition Interface */}
            <svg
              className="w-full h-full opacity-90"
              viewBox="0 0 400 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background circles */}
              <circle
                cx="200"
                cy="300"
                r="180"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="200"
                cy="300"
                r="140"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="200"
                cy="300"
                r="100"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                fill="none"
              />

              {/* Face outline */}
              <ellipse
                cx="200"
                cy="280"
                rx="80"
                ry="100"
                stroke="rgba(99, 102, 241, 0.8)"
                strokeWidth="3"
                fill="none"
              />

              {/* Eyes */}
              <circle cx="180" cy="260" r="8" fill="rgba(99, 102, 241, 0.8)" />
              <circle cx="220" cy="260" r="8" fill="rgba(139, 92, 246, 0.8)" />

              {/* Nose */}
              <line
                x1="200"
                y1="280"
                x2="200"
                y2="300"
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth="2"
              />

              {/* Mouth */}
              <path
                d="M 185 320 Q 200 330 215 320"
                stroke="rgba(99, 102, 241, 0.7)"
                strokeWidth="2"
                fill="none"
              />

              {/* Detection grid */}
              <g stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1">
                <line x1="150" y1="200" x2="250" y2="200" />
                <line x1="150" y1="240" x2="250" y2="240" />
                <line x1="150" y1="280" x2="250" y2="280" />
                <line x1="150" y1="320" x2="250" y2="320" />
                <line x1="150" y1="360" x2="250" y2="360" />
                <line x1="150" y1="200" x2="150" y2="360" />
                <line x1="175" y1="200" x2="175" y2="360" />
                <line x1="200" y1="200" x2="200" y2="360" />
                <line x1="225" y1="200" x2="225" y2="360" />
                <line x1="250" y1="200" x2="250" y2="360" />
              </g>

              {/* Corner brackets */}
              <g stroke="rgba(99, 102, 241, 1)" strokeWidth="3">
                <path d="M 120 180 L 120 200 L 140 200" fill="none" />
                <path d="M 280 180 L 280 200 L 260 200" fill="none" />
                <path d="M 120 380 L 120 360 L 140 360" fill="none" />
                <path d="M 280 380 L 280 360 L 260 360" fill="none" />
              </g>

              {/* Detection points */}
              <circle cx="180" cy="260" r="3" fill="rgba(99, 102, 241, 1)">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="220" cy="260" r="3" fill="rgba(139, 92, 246, 1)">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="200" cy="280" r="3" fill="rgba(59, 130, 246, 1)">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="200" cy="320" r="3" fill="rgba(99, 102, 241, 1)">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Scanning line */}
              <line
                x1="120"
                y1="200"
                x2="280"
                y2="200"
                stroke="rgba(99, 102, 241, 0.8)"
                strokeWidth="2"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,160; 0,0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form with Background Animations */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        {/* Right Side Background Animations */}
        <Link
          to="/"
          className="absolute top-0 left-0 z-20 md:top-4 md:left-4  text-white whitespace-nowrap pl-4 mt-4 cursor-pointer hover:text-blue-400 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        <div className="absolute inset-0 z-0">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tl from-black/20 via-indigo-900/10 to-purple-900/10"></div>

          {/* Floating particles for right side */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <div
                key={`right-${i}`}
                className={`absolute rounded-full opacity-40 ${
                  i % 4 === 0
                    ? "w-0.5 h-0.5 bg-indigo-400"
                    : i % 4 === 1
                    ? "w-1 h-1 bg-purple-400"
                    : i % 4 === 2
                    ? "w-0.5 h-0.5 bg-blue-400"
                    : "w-1.5 h-1.5 bg-indigo-300"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${
                    3 + Math.random() * 4
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Data streams for right side */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={`stream-${i}`}
                className="absolute w-px bg-gradient-to-b from-transparent via-indigo-300/20 to-transparent opacity-60"
                style={{
                  left: `${10 + i * 12}%`,
                  height: `${40 + Math.random() * 30}%`,
                  animation: `matrix-fall ${
                    5 + Math.random() * 4
                  }s linear infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Geometric shapes for right side */}
          <div className="absolute top-32 right-16 w-16 h-16 border border-indigo-400/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 left-16 w-12 h-12 border border-purple-400/30 rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-blue-400/30 rounded-full animate-bounce"></div>
          <div className="absolute top-16 left-1/3 w-6 h-6 border border-indigo-400/25 rotate-12 animate-float-slow"></div>
          <div className="absolute bottom-16 right-1/3 w-10 h-10 border border-purple-400/25 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-orbit"></div>

          {/* Subtle scanning lines for right side */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-scan-horizontal"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-scan-horizontal-reverse"></div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Form Header */}
          <div className="text-left  pt-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-300 text-lg">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-gray-200 font-medium text-sm"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-indigo-300/50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all duration-300"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-gray-200 font-medium text-sm"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-indigo-300/50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all duration-300"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-200"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign In</span>
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-400/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-indigo-900/50 text-gray-300 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Face Recognition Button */}
            <button
              type="button"
              onClick={() =>
                toast("Face recognition login coming soon!", {
                  icon: "🔬",
                  style: {
                    borderRadius: "12px",
                    background: "#1e293b",
                    color: "#f8fafc",
                    border: "1px solid #4f46e5",
                  },
                })
              }
              className="w-full py-4 px-6 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-indigo-300/50 hover:border-indigo-400 text-gray-900 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <div className="absolute inset-0 border-2 border-indigo-400/50 rounded-full animate-ping group-hover:animate-pulse"></div>
                </div>
                <span>Face Recognition Login</span>
                <div className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full">
                  BETA
                </div>
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors duration-300"
              >
                Sign up now
              </Link>
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Fast
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Trusted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-15px) rotate(2deg) scale(1.1); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes pulse-fast {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            25% { opacity: 0.9; transform: scale(1.1); }
            75% { opacity: 0.6; transform: scale(0.95); }
          }
          
          @keyframes pulse-grid {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.4; }
          }
          
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
          }
          
          @keyframes orbit-reverse {
            0% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
            100% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
          }
          
          @keyframes orbit-slow {
            0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
          }
          
          @keyframes matrix-fall {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes scan-horizontal {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          
          @keyframes scan-horizontal-reverse {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
          }
          
          @keyframes scan-vertical {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
          }
          
          @keyframes scan-vertical-reverse {
            0% { transform: translateY(100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-100%); opacity: 0; }
          }
          
          @keyframes scan-diagonal {
            0% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateX(100%) translateY(100%); opacity: 0; }
          }
          
          @keyframes scan-diagonal-reverse {
            0% { transform: translateX(100%) translateY(100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
          }
          
          @keyframes scan-down {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(3200%); opacity: 0; }
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .animate-spin-reverse {
            animation: spin-reverse 15s linear infinite;
          }
          
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-pulse-fast {
            animation: pulse-fast 2s ease-in-out infinite;
          }
          
          .animate-pulse-grid {
            animation: pulse-grid 3s ease-in-out infinite;
          }
          
          .animate-orbit {
            animation: orbit 8s linear infinite;
          }
          
          .animate-orbit-reverse {
            animation: orbit-reverse 6s linear infinite;
          }
          
          .animate-orbit-slow {
            animation: orbit-slow 12s linear infinite;
          }
          
          .animate-scan-horizontal {
            animation: scan-horizontal 4s ease-in-out infinite;
          }
          
          .animate-scan-horizontal-reverse {
            animation: scan-horizontal-reverse 3s ease-in-out infinite;
            animation-delay: 1s;
          }
          
          .animate-scan-vertical {
            animation: scan-vertical 5s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          
          .animate-scan-vertical-reverse {
            animation: scan-vertical-reverse 4s ease-in-out infinite;
            animation-delay: 2s;
          }
          
          .animate-scan-diagonal {
            animation: scan-diagonal 6s ease-in-out infinite;
            animation-delay: 1.5s;
          }
          
          .animate-scan-diagonal-reverse {
            animation: scan-diagonal-reverse 7s ease-in-out infinite;
            animation-delay: 3s;
          }
          
          .animate-scan-down {
            animation: scan-down 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
