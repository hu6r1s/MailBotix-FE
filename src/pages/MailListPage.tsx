import apiClient from '@apis/axiosConfig';
import MailDetailPanel from '@components/MailDetailPanel';
import MailListPanel from '@components/MailListPanel';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export interface GmailMessage {
  messageId: string;
  threadId: string;
  date: string;
  headers: {
    subject: string;
    from: string;
  };
  important: boolean;
  hasAttachment: boolean;
  starred: boolean;
  unread: boolean;
}

const MailListPage: React.FC = () => {
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(380);
  const isResizing = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<GmailMessage[]>('/mail/list');
        setEmails(response.data);
      } catch (err: any) {
        console.error('Error fetching emails:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load emails.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const newWidth = Math.max(200, Math.min(e.clientX, window.innerWidth - 200));
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* 왼쪽 패널 */}
      <div style={{ width: sidebarWidth }} className="border-r border-gray-200 bg-white">
        <MailListPanel emails={emails} onSelect={setSelectedEmail} />
      </div>

      {/* 리사이저 */}
      <div
        className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 z-10"
        onMouseDown={() => (isResizing.current = true)}
      />

      {/* 오른쪽 패널 */}
      <div className="flex-1">
        <MailDetailPanel email={selectedEmail} />
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-20"
      >
        Logout
      </button>
    </div>
  );
}

export default MailListPage;