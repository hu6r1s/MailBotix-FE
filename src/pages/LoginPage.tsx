import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@apis/axiosConfig';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorParam = queryParams.get('error');
    if (errorParam) {
      setError(`Login failed: ${errorParam}`);
    }
  }, [location]);
  
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const response = await apiClient.get<string>('/auth/google/url');
      const authUrl = response.data;
      window.location.href = authUrl;
    } catch(err) {
      console.error('Error fetching Google Auth URL: ', err);
      setError('Failed to start Google authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Welcome to MailBotix</h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Sign in with Google
          </span>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </button>
      </div>
    </div>
  );
};
