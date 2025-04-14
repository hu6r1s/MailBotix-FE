import { LoginPage } from "@pages/LoginPage";
import './App.css';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import apiClient from "@apis/axiosConfig";
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MailListPage from "@pages/MailListPage";

interface AuthStatus {
  loading: boolean;
  loggedIn: boolean;
}

const AuthContext = createContext<AuthStatus | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    loading: true,
    loggedIn: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get<{ loggedIn: boolean }>('/auth/status');
        setAuthStatus({ loading: false, loggedIn: response.data.loggedIn });
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthStatus({ loading: false, loggedIn: false });
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={authStatus}>
      {!authStatus.loading && children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <div>Loading...</div>;
  if (auth.loading) return <div>Loading...</div>;

  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* 인증이 필요한 라우트 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MailListPage />} />
              {/* <Route path="/" element={<Navigate to="/mail/list" replace />} /> */}
            </Route>
            {/* 일치하는 경로 없을 시 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
