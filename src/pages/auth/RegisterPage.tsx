import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Link
        to="/"
        className="absolute top-0 left-0 z-20 md:top-4 md:left-4  text-white whitespace-nowrap pl-4 mt-4 cursor-pointer hover:text-blue-400 flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Home
      </Link>

      {/* Header Section */}
      <div className="relative z-10 text-center py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Attendance System
            </span>
          </h1>

          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm md:text-base">
              Choose Your Organization Role
            </span>
          </div>
        </div>
      </div>

      {/* Main Registration Cards Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        {/* Cards Grid */}
        <div className="w-full max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Organization Admin Card */}
            <div className="group relative w-full min-h-[600px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20 hover:bg-white transition-all duration-500 w-full h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                    Organization Admin
                  </h3>

                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    Create and manage your organization's attendance system
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
                  {[
                    { icon: "🏢", text: "Create Organization Profile" },
                    { icon: "👥", text: "Manage Team Members" },
                    { icon: "📊", text: "Analytics & Reports" },
                    { icon: "⚙️", text: "System Configuration" },
                    { icon: "🔐", text: "Security & Access Control" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors duration-300"
                    >
                      <span className="text-xl md:text-2xl flex-shrink-0">
                        {feature.icon}
                      </span>
                      <span className="text-gray-700 font-medium text-sm md:text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link
                    to="/organization-register"
                    className="block w-full text-center px-6 md:px-8 py-4 md:py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    Create Organization
                    <svg
                      className="inline-block w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Badge */}
                <div className="absolute -top-3 md:-top-4 -right-3 md:-right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg transform rotate-12">
                  Admin
                </div>
              </div>
            </div>

            {/* Team Member Card */}
            <div className="group relative w-full min-h-[600px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20 hover:bg-white transition-all duration-500 w-full h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                    Team Member
                  </h3>

                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    Join your organization using an invitation code
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
                  {[
                    { icon: "🎫", text: "Use Invitation Code" },
                    { icon: "👤", text: "Personal Profile Setup" },
                    { icon: "📱", text: "Face Recognition Enrollment" },
                    { icon: "⏱️", text: "Quick Attendance Marking" },
                    { icon: "📈", text: "Track Your Attendance" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl bg-blue-50 border border-blue-100 group-hover:bg-blue-100 transition-colors duration-300"
                    >
                      <span className="text-xl md:text-2xl flex-shrink-0">
                        {feature.icon}
                      </span>
                      <span className="text-gray-700 font-medium text-sm md:text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link
                    to="/employee-register"
                    className="block w-full text-center px-6 md:px-8 py-4 md:py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    Join Organization
                    <svg
                      className="inline-block w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Badge */}
                <div className="absolute -top-3 md:-top-4 -right-3 md:-right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg transform rotate-12">
                  Member
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Section */}
        <div className="mt-16 md:mt-20 w-full max-w-none">
          <div className="text-center mb-8 md:mb-12">
            <h4 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              How It Works
            </h4>
            <p className="text-lg md:text-xl text-gray-300">
              Simple steps to get started with SmartAttend
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Admin Process */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 w-full">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 md:mr-4">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h5 className="text-xl md:text-2xl font-bold text-white">
                  For Administrators
                </h5>
              </div>

              <div className="space-y-3 md:space-y-4">
                {[
                  "Set up organization profile",
                  "Generate invitation codes",
                  "Approve member requests",
                  "Configure attendance settings",
                  "Monitor and manage attendance",
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 md:space-x-4"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-200 text-sm md:text-base">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Process */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 w-full">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3 md:mr-4">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h5 className="text-xl md:text-2xl font-bold text-white">
                  For Team Members
                </h5>
              </div>

              <div className="space-y-3 md:space-y-4">
                {[
                  "Get invitation code from admin",
                  "Register with organization code",
                  "Wait for admin approval",
                  "Complete face enrollment",
                  "Start marking attendance",
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 md:space-x-4"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-200 text-sm md:text-base">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mb-4 md:mb-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-medium text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300"
          >
            Already have an account?
            <span className="ml-2 text-indigo-400 font-bold">Sign In →</span>
          </Link>
        </div>

        <p className="text-gray-400 text-xs md:text-sm">
          Secure • Reliable • Efficient Attendance Management
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
