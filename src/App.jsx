import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// 15 Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ReportLostItemPage from './pages/ReportLostItemPage';
import ReportFoundItemPage from './pages/ReportFoundItemPage';
import LostItemsListPage from './pages/LostItemsListPage';
import FoundItemsListPage from './pages/FoundItemsListPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import AIMatchingResultsPage from './pages/AIMatchingResultsPage';
import NearbyItemsMapPage from './pages/NearbyItemsMapPage';
import NotificationsPage from './pages/NotificationsPage';
import OwnershipClaimPage from './pages/OwnershipClaimPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* 1. Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Registration Page */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 3. Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* 4. User Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Report Lost Item */}
                <Route
                  path="/report-lost"
                  element={
                    <ProtectedRoute>
                      <ReportLostItemPage />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Report Found Item */}
                <Route
                  path="/report-found"
                  element={
                    <ProtectedRoute>
                      <ReportFoundItemPage />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Lost Items Listing */}
                <Route path="/lost-items" element={<LostItemsListPage />} />

                {/* 8. Found Items Listing */}
                <Route path="/found-items" element={<FoundItemsListPage />} />

                {/* 9. Item Details Page */}
                <Route path="/items/:type/:id" element={<ItemDetailsPage />} />

                {/* 10. AI Matching Results */}
                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute>
                      <AIMatchingResultsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 11. Nearby Items Map */}
                <Route path="/map" element={<NearbyItemsMapPage />} />

                {/* 12. Notifications Center */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 13. Ownership Claim Page */}
                <Route
                  path="/claims"
                  element={
                    <ProtectedRoute>
                      <OwnershipClaimPage />
                    </ProtectedRoute>
                  }
                />

                {/* 14. User Profile Page */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 15. Admin Dashboard */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
