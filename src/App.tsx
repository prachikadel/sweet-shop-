import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl">🍬</span>
          </div>
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage onSuccess={() => {}} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;