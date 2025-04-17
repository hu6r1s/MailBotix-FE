import React, { useEffect, useState } from 'react';
import apiClient from '@apis/axiosConfig';
import ReplyGenerator from '@components/ReplyGenerator';
import { Send } from 'lucide-react';

interface Props {
  messageId: string | null;
}

interface Attachment {
  filename: string;
  size: number;
  data: string;
  mimeType: string;
}

interface GmailMessageDetail {
  threadId: string;
  headers: {
    date: string;
    subject: string;
    from: string;
    to: string;
  };
  attachments: Attachment[];
  body: string;
}

const formatSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function downloadAttachment(filename: string, base64Data: string, mimeType: string) {
  try {
    const cleanedBase64 = base64Data.replace(/-/g, '+').replace(/_/g, '/');

    const paddedBase64 = cleanedBase64.padEnd(Math.ceil(cleanedBase64.length / 4) * 4, '=');

    const byteCharacters = atob(paddedBase64);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    alert('첨부파일 다운로드 중 오류가 발생했습니다.');
  }
}


const MailDetailPanel: React.FC<Props> = ({ messageId }) => {
  const [email, setEmail] = useState<GmailMessageDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    if (!messageId) {
      setEmail(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<GmailMessageDetail>(`/mail/read/${messageId}`);
        setEmail(response.data);
      } catch (error) {
        console.error('메일 내용 로딩 실패:', error);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [messageId]);

  const handleSendReply = async () => {
    try {
      await apiClient.post('/mail/send', {
        threadId: email?.threadId,
        to: email?.headers.from,
        subject: `Re: ${email?.headers.subject}`,
        messageContent: replyContent,
        originalMessageId: messageId,
      });
      alert('메일이 전송되었습니다!');
      setReplyContent('');
    } catch (err) {
      alert('메일 전송 실패');
    } finally {
      setSending(false);
    }
  };

  if (!messageId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-lg">
        메일을 선택해 주세요.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-base">
        메일을 불러오는 중...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 text-base">
        메일을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-2">{email.headers.subject}</h2>
      <p className="text-sm text-gray-600 mb-4">
        From: {email.headers.from}<br />
        Date: {email.headers.date}
      </p>

      <div className="text-gray-800 whitespace-pre-wrap mb-6">
        {email.body}
      </div>

      {email.attachments.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">첨부파일</h3>
          <ul className="space-y-2">
            {email.attachments.map((att, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between border rounded px-4 py-2 bg-white hover:bg-gray-100 transition cursor-pointer shadow-sm"
                onClick={() => downloadAttachment(att.filename, att.data, att.mimeType)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">📎</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 hover:underline">{att.filename}</span>
                    <span className="text-xs text-gray-500">
                      {formatSize(att.size)} • {att.mimeType}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 border-t pt-4">
        <textarea
          className="w-full border rounded p-3 mt-4 h-40"
          placeholder="답장을 입력하세요..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />

        <div className="flex items-center justify-between mt-4">
          <div>
            <ReplyGenerator
              emailBody={email.body}
              onReplyGenerated={(generated) => setReplyContent(generated)}
            />
          </div>
          <button
            onClick={handleSendReply}
            disabled={sending || !replyContent}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Send size={16} className="mr-1" />
            {sending ? '전송 중...' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailDetailPanel;
