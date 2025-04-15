import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 에러 처리
      console.error("Unauthorized! Redirecting to login...");
      alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');

      window.location.href = '/login'; // '/login'은 실제 로그인 페이지 경로
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;