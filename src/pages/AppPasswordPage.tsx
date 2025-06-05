import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

const SECRET_KEY = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY as string);
const IV = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_IV as string);

const isValidPassword = (pw: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?:(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,16}|[A-Za-z\d]{8,16})$/;
  return regex.test(pw);
};

export const AppPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword(password)) return alert('계정 패스워드 또는 앱 비밀번호를 입력해주세요.');

    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext.toString(CryptoJS.enc.Base64);

    Cookies.set('app_password', encrypted, { expires: 1, secure: true, sameSite: "Lax", path: "/" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">패스워드 저장 완료</h2>
          <p>메일을 불러올 수 있도록 설정되었습니다.</p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 underline">
            → 대시보드로 이동
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-left w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">계정 패스워드 / 앱 비밀번호를 입력해주세요</h2>
        <p className="text-sm text-gray-600 mb-4">
          네이버 메일 API가 없어 <strong>IMAP</strong>을 사용합니다. 이를 위해
          <strong>계정 패스워드</strong>나<strong> 앱 비밀번호</strong>가 필요합니다.<br /><br />
          <strong>입력된 비밀번호는 안전하게 암호화됩니다.</strong>
        </p>
        <a
          href="https://help.naver.com/service/5640/contents/8584?lang=ko&osType=COMMONOS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline"
        >
          👉 앱 비밀번호 설정 방법 보러가기
        </a>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700">
              앱 비밀번호
            </label>
            <input
              type="password"
              id="appPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            저장하고 계속하기
          </button>
        </form>
      </div>
    </div>
  );
};
