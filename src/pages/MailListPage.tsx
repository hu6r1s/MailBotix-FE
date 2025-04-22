import apiClient from '@apis/axiosConfig';
import MailDetailPanel from '@components/MailDetailPanel';
import MailDetailSkeleton from '@components/MailDetailSkeleton';
import MailListPanel from '@components/MailListPanel';
import MailListSkeleton from '@components/MailListSkeleton';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export interface GmailMessage {
  messageId: string;
  date: string;
  headers: {
    subject: string;
    from: string;
  };
  hasAttachment: boolean;
  starred: boolean;
  unread: boolean;
}

const MailListPage: React.FC = () => {
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(380);
  const isResizing = useRef<boolean>(false);
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(10);
  
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setSelectedMessageId(null);
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<GmailMessage[]>(`/mail/list?size=${pageSize}`);
        setEmails(response.data);
      } catch (err: any) {
        console.error('Error fetching emails:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load emails.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [navigate, pageSize]);

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

  return (
    <div className="flex h-screen overflow-hidden relative">
      {loading ? (
        <>
          <div style={{ width: sidebarWidth }} className="border-r border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b animate-pulse">
                <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
             </div>
            <MailListSkeleton />
          </div>
          <div className="w-1 bg-gray-200" />
          <div className="flex-1 overflow-hidden">
            <MailDetailSkeleton />
          </div>
        </>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-full text-red-500">
          <p>{error}</p>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-20"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden relative w-full">
          <div style={{ width: sidebarWidth }} className="border-r border-gray-200 bg-white w-1/3">
            <MailListPanel emails={emails} onSelectMessage={setSelectedMessageId} onSizeChange={handlePageSizeChange} currentSize={pageSize} />
          </div>

          <div
            className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 z-10"
            onMouseDown={() => (isResizing.current = true)}
          />

          <div className="flex-1 w-2/3">
            <MailDetailPanel messageId={selectedMessageId} />
          </div>

          <button
            onClick={handleLogout}
            className="absolute top-4 right-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-20"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MailListPage;