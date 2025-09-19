import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { RegisterDto } from '../types';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterDto>({
    name:'',
    email: '',
    password: '',
    role: 'user',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      const { [name]: removed, ...rest } = errors;
      setErrors(rest);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="name"
          name="name"
          type="name"
         value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
            errors.password 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Enter your name"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
            errors.password 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
            errors.confirmPassword 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Account Type
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                     focus:ring-blue-200 focus:outline-none focus:ring-2 transition-colors duration-200"
        >
          <option value="user">Customer</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 
                   text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 
                   transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus size={20} />
            Create Account
          </>
        )}
      </button>
    </form>
  );
}