import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { LoginDto } from '../types';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginDto> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');
      await login(formData);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginDto]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
            errors.email 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
            errors.password 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                   text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 
                   transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn size={20} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}