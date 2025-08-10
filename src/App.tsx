import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import { OfflineProvider } from "./contexts/OfflineContext.tsx";

// Components
import LoadingSpinner from "./components/common/LoadingSpinner.tsx";
import OfflineIndicator from "./components/common/OfflineIndicator.tsx";

// Pages
import LandingPage from "./pages/LandingPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import ReviewsPage from "./pages/ReviewsPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.tsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.tsx";
import OrganizationRegistration from "./pages/auth/OrganizationRegistration.tsx";
import EmployeeRegistration from "./pages/auth/EmployeeRegistration.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import AttendancePage from "./pages/attendance/AttendancePage.tsx";
import FaceEnrollmentPage from "./pages/auth/FaceEnrollmentPage.tsx";
import AadhaarVerificationPage from "./pages/auth/AadhaarVerificationPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import UserManagementPage from "./pages/admin/UserManagementPage.tsx";
import AttendanceManagementPage from "./pages/admin/AttendanceManagementPage.tsx";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard.tsx";
import ComprehensiveUserManagement from "./pages/admin/ComprehensiveUserManagement.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

// Layout
import Layout from "./components/layout/Layout.tsx";
import AuthLayout from "./components/layout/AuthLayout.tsx";

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireApproval?: boolean;
  requireFaceEnrollment?: boolean;
  roles?: ("admin" | "hr" | "employee" | "super-admin")[];
}> = ({
  children,
  requireApproval = true,
  requireFaceEnrollment = false,
  roles = [],
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireApproval && !user.isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (requireFaceEnrollment && !user.faceEnrolled) {
    return <Navigate to="/face-enrollment" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already authenticated to auth pages)
const PublicRoute: React.FC<{
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}> = ({ children, redirectAuthenticated = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && redirectAuthenticated) {
    if (!user.isApproved) {
      return <Navigate to="/pending-approval" replace />;
    }
    if (!user.faceEnrolled) {
      return <Navigate to="/face-enrollment" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Pending Approval Page
const PendingApprovalPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Account Pending Approval
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been registered successfully but is waiting for
              admin approval.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm">
                  <p>
                    <strong>Name:</strong> {user?.firstName} {user?.lastName}
                  </p>
                  <p>
                    <strong>Employee ID:</strong> {user?.employeeId}
                  </p>
                  <p>
                    <strong>Department:</strong> {user?.department}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Please contact your administrator or HR department to approve
                your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/organization-register"
        element={
          <PublicRoute>
            <OrganizationRegistration />
          </PublicRoute>
        }
      />

      <Route
        path="/employee-register"
        element={
          <PublicRoute>
            <EmployeeRegistration />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Special Routes */}
      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute requireApproval={false}>
            <PendingApprovalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/face-enrollment"
        element={
          <ProtectedRoute requireFaceEnrollment={false}>
            <Layout>
              <FaceEnrollmentPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/aadhaar-verification"
        element={
          <ProtectedRoute>
            <Layout>
              <AadhaarVerificationPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute requireFaceEnrollment={true}>
            <Layout>
              <AttendancePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <Layout>
              <ChangePasswordPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin", "hr"]}>
            <Layout>
              <AdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin", "hr"]}>
            <Layout>
              <UserManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute roles={["admin", "hr"]}>
            <Layout>
              <AttendanceManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute roles={["super-admin"]}>
            <Layout>
              <SuperAdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Comprehensive User Management - Replace old user management */}
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute roles={["admin", "hr"]}>
            <Layout>
              <ComprehensiveUserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Public Static Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Any app initialization logic
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <AuthProvider>
        <OfflineProvider>
          <div className="App">
            <AppRoutes />
            <OfflineIndicator />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </OfflineProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
