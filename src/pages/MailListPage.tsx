import apiClient from '@apis/axiosConfig';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface GmailMessage {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Emails</h2>
       <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.messageId}>
              MessageID: {email.messageId}, ThreadID: {email.threadId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MailListPage;