import React, { useState } from 'react';
import { Candy } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

interface AuthPageProps {
  onSuccess: () => void;
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
            <Candy size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sweet Shop</h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {isLogin ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <RegisterForm onSuccess={onSuccess} />
          )}

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}