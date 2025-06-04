import apiClient from '@apis/axiosConfig';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    } catch (err) {
      console.error('Error fetching Google Auth URL: ', err);
      setError('Failed to start Google authentication. Please try again.');
    }
  };

  const handleNaverLogin = async () => {
    try {
      setError(null);
      const response = await apiClient.get<string>('/auth/naver/url');
      const authUrl = response.data;
      window.location.href = authUrl;
    } catch (err: any) {
      console.error('Error fetching Naver Auth URL: ', err);
      setError(err.response?.data?.message || 'Failed to start Naver authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Welcome to MailBotix</h1>
        {/* Google Login Button */}
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

        </button>

        {/* Naver Login Button */}
        <button
          onClick={handleNaverLogin}
          className="mt-4 flex items-center justify-center w-full gap-3 px-4 py-3 border border-transparent rounded-lg shadow-sm bg-[#03C75A] hover:opacity-90 transition text-white"
          aria-label="Sign in with Naver"
        >
          <svg className="w-5 h-5" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.2588 9.01111L7.84763 3.55926H3.40332V14.4333H7.9206V9.0037L11.3317 14.4407H15.776V3.55926H11.2588V9.01111Z" fill="white" />
          </svg>
          <span className="text-sm font-medium">
            Sign in with Naver
          </span>
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
